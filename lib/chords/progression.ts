import type { NoteName, ChordQuality, Chord } from "./types";

const STANDARD_PROGRESSIONS: Record<string, Array<{ root: number; quality: ChordQuality }>> = {
  "I-IV-V": [{ root: 0, quality: "maj" }, { root: 3, quality: "maj" }, { root: 4, quality: "maj" }],
  "ii-V-I": [{ root: 1, quality: "min" }, { root: 4, quality: "dom7" }, { root: 0, quality: "maj7" }],
  "I-V-vi-IV": [{ root: 0, quality: "maj" }, { root: 4, quality: "maj" }, { root: 5, quality: "min" }, { root: 3, quality: "maj" }],
  "vi-IV-I-V": [{ root: 5, quality: "min" }, { root: 3, quality: "maj" }, { root: 0, quality: "maj" }, { root: 4, quality: "maj" }],
  "I-vi-IV-V": [{ root: 0, quality: "maj" }, { root: 5, quality: "min" }, { root: 3, quality: "maj" }, { root: 4, quality: "maj" }],
  "12-bar-blues": [
    { root: 0, quality: "dom7" }, { root: 0, quality: "dom7" }, { root: 0, quality: "dom7" }, { root: 0, quality: "dom7" },
    { root: 3, quality: "dom7" }, { root: 3, quality: "dom7" }, { root: 0, quality: "dom7" }, { root: 0, quality: "dom7" },
    { root: 4, quality: "dom7" }, { root: 3, quality: "dom7" }, { root: 0, quality: "dom7" }, { root: 4, quality: "dom7" },
  ],
};

const MAJOR_SCALE: NoteName[] = ["C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B"];
const NOTE_SEMITONES: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

function getDegreeRoot(tonic: NoteName, degree: number): NoteName {
  const tonicIndex = NOTE_SEMITONES[tonic];
  const degreeIndex = (tonicIndex + degree) % 12;
  return MAJOR_SCALE[degreeIndex];
}

export function getProgression(name: string, key: NoteName = "C"): Chord[] {
  const template = STANDARD_PROGRESSIONS[name];
  if (!template) return [];
  return template.map((step) => ({
    root: getDegreeRoot(key, step.root),
    quality: step.quality,
    notes: [],
  }));
}

export function detectProgression(chords: Chord[]): string | null {
  if (chords.length < 2) return null;
  const pattern = chords.map((c) => c.root + (c.quality === "min" ? "m" : "")).join("-");
  const known = Object.keys(STANDARD_PROGRESSIONS);
  for (const name of known) {
    const prog = getProgression(name);
    const progPattern = prog.map((c) => c.root + (c.quality === "min" ? "m" : "")).join("-");
    if (pattern === progPattern) return name;
  }
  return null;
}

export function getProgressionNames(): string[] {
  return Object.keys(STANDARD_PROGRESSIONS);
}
