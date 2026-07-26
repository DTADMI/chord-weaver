"use client";

import { useState, useRef, useCallback } from "react";

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

  const updateTime = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      setCurrentTime(audioRef.current.currentTime);
      rafRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
    setIsPlaying(true);
    rafRef.current = requestAnimationFrame(updateTime);
  }, [updateTime]);

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
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    setVolumeState(vol);
  }, []);

  const loadUrl = useCallback((url: string) => {
    stop();
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration ?? 0);
      };
    }
  }, [stop]);

  const loadBlob = useCallback((blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    loadUrl(url);
    return url;
  }, [loadUrl]);

  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
  }

  return {
    isPlaying, currentTime, duration, volume,
    play, pause, stop, seekTo, setVolume, loadUrl, loadBlob,
  };
}
