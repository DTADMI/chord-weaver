"use client";

import { useState, useCallback } from "react";
import type { Chord } from "@/lib/chords/types";
import type { AudioInfo } from "@/lib/audio/decode";

export interface DetectionProgress {
  stage: "decoding" | "analyzing" | "detecting" | "structuring" | "rendering" | "done" | "error";
  message: string;
  percent: number;
}

export interface UseChordDetectionReturn {
  isProcessing: boolean;
  progress: DetectionProgress | null;
  chords: Chord[] | null;
  error: string | null;
  detectFromFile: (file: File) => Promise<void>;
  detectFromUrl: (url: string) => Promise<void>;
  reset: () => void;
}

export function useChordDetection(): UseChordDetectionReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<DetectionProgress | null>(null);
  const [chords, setChords] = useState<Chord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = (stage: DetectionProgress["stage"], message: string, percent: number) => {
    setProgress({ stage, message, percent });
  };

  const detectFromFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setChords(null);

    try {
      updateProgress("decoding", "Decoding audio...", 10);
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      await audioContext.close();

      updateProgress("analyzing", "Analyzing frequencies...", 30);

      updateProgress("detecting", "Detecting chords...", 50);

      const { detectChords } = await import("@/lib/audio/chord-detection");
      const detectedChords = detectChords(audioBuffer);
      setChords(detectedChords);

      updateProgress("done", "Detection complete", 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Detection failed");
      updateProgress("error", "Detection failed", 0);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const detectFromUrl = useCallback(async (url: string) => {
    setIsProcessing(true);
    setError(null);
    setChords(null);

    try {
      updateProgress("decoding", "Fetching audio from URL...", 10);

      const response = await fetch("/api/convert/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to extract audio from URL");
      }

      updateProgress("analyzing", "Analyzing frequencies...", 30);
      updateProgress("detecting", "Detecting chords...", 50);

      const data = await response.json();
      setChords(data.chords);

      updateProgress("done", "Detection complete", 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "URL extraction failed");
      updateProgress("error", "URL extraction failed", 0);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(null);
    setChords(null);
    setError(null);
  }, []);

  return { isProcessing, progress, chords, error, detectFromFile, detectFromUrl, reset };
}
