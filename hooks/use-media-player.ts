"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface UseMediaPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setVolume: (vol: number) => void;
  loadUrl: (url: string) => void;
  loadBlob: (blob: Blob) => string;
}

export function useMediaPlayer(): UseMediaPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const loopRef = useRef<(() => void) | null>(null);

  // Lazy-init the Audio element once (outside render).
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current = null;
    };
  }, []);

  // Keep the audio element's volume in sync with state.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Self-perpetuating rAF loop for time tracking.
  useEffect(() => {
    const loop = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = loop;
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
    setIsPlaying(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => loopRef.current?.());
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
  }, []);

  const loadUrl = useCallback(
    (url: string) => {
      stop();
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
        audioRef.current.onloadedmetadata = () => {
          setDuration(audioRef.current?.duration ?? 0);
        };
      }
    },
    [stop],
  );

  const loadBlob = useCallback(
    (blob: Blob): string => {
      const url = URL.createObjectURL(blob);
      loadUrl(url);
      return url;
    },
    [loadUrl],
  );

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    loadUrl,
    loadBlob,
  };
}
