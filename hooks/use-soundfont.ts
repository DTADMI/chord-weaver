"use client";

import { useState, useRef, useCallback } from "react";

export interface SoundFontPlayer {
  isLoaded: boolean;
  isLoading: boolean;
  isPlaying: boolean;
  load: (url?: string) => Promise<void>;
  playNote: (note: string, duration?: number) => void;
  playChord: (notes: string[], duration?: number) => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

export function useSoundFont(): SoundFontPlayer {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const currentOscillatorsRef = useRef<OscillatorNode[]>([]);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.3;
    }
    return audioContextRef.current;
  }, []);

  const load = useCallback(async (_url?: string) => {
    setIsLoading(true);
    try {
      getContext();
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [getContext]);

  const stop = useCallback(() => {
    for (const osc of currentOscillatorsRef.current) {
      try { osc.stop(); } catch {}
    }
    currentOscillatorsRef.current = [];
    setIsPlaying(false);
  }, []);

  const noteToFrequency = useCallback((note: string): number => {
    const noteMap: Record<string, number> = {
      C: 261.63, "C": 277.18, D: 293.66, "D": 311.13,
      E: 329.63, F: 349.23, "F": 369.99, G: 392.00,
      "G": 415.30, A: 440.00, "A": 466.16, B: 493.88,
    };
    return noteMap[note] ?? 440;
  }, []);

  const playNote = useCallback((note: string, duration = 0.5) => {
    const ctx = getContext();
    stop();

    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = noteToFrequency(note);
    env.gain.setValueAtTime(0.3, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(env);
    env.connect(gainNodeRef.current ?? ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    currentOscillatorsRef.current = [osc];
    setIsPlaying(true);
    osc.onended = () => { setIsPlaying(false); };
  }, [getContext, stop, noteToFrequency]);

  const playChord = useCallback((notes: string[], duration = 2) => {
    const ctx = getContext();
    stop();

    const oscillators = notes.map((note, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.value = noteToFrequency(note);
      const delay = i * 0.05;
      env.gain.setValueAtTime(0, ctx.currentTime + delay);
      env.gain.linearRampToValueAtTime(0.2, ctx.currentTime + delay + 0.02);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(env);
      env.connect(gainNodeRef.current ?? ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + duration);
      return osc;
    });

    currentOscillatorsRef.current = oscillators;
    setIsPlaying(true);
  }, [getContext, stop, noteToFrequency]);

  const setVolume = useCallback((volume: number) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    isLoaded,
    isLoading,
    isPlaying,
    load,
    playNote,
    playChord,
    stop,
    setVolume,
  };
}
