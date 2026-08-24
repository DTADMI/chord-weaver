import type { NoteName, ChordQuality, Chord } from "./types";

const NOTE_SEMITONES: Record<NoteName, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

const SEMITONE_TO_NOTE: NoteName[] = [
  "C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B",
];

const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  dom7: [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dim7: [0, 3, 6, 9],
  aug7: [0, 4, 8, 10],
  m7b5: [0, 3, 6, 10],
  mMaj7: [0, 3, 7, 11],
  add9: [0, 4, 7, 14],
  madd9: [0, 3, 7, 14],
  dom9: [0, 4, 7, 10, 14],
  dom13: [0, 4, 7, 10, 14, 21],
  "6": [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
};

export function getChordNotes(root: NoteName, quality: ChordQuality): NoteName[] {
  const rootSemitone = NOTE_SEMITONES[root];
  const intervals = CHORD_INTERVALS[quality];
  if (!intervals) return [root];
  return intervals.map((i) => SEMITONE_TO_NOTE[(rootSemitone + i) % 12]);
}

export function buildChord(root: NoteName, quality: ChordQuality): Chord {
  return {
    root,
    quality,
    notes: getChordNotes(root, quality),
  };
}

export function chordToString(chord: Chord): string {
  let result = chord.root;
  const qualityMap: Record<ChordQuality, string> = {
    maj: "",
    min: "m",
    dim: "dim",
    aug: "aug",
    sus2: "sus2",
    sus4: "sus4",
    dom7: "7",
    maj7: "maj7",
    min7: "m7",
    dim7: "dim7",
    aug7: "aug7",
    m7b5: "m7b5",
    mMaj7: "mMaj7",
    add9: "add9",
    madd9: "madd9",
    dom9: "9",
    dom13: "13",
    "6": "6",
    m6: "m6",
  };
  result += qualityMap[chord.quality] || "";
  if (chord.bass && chord.bass !== chord.root) {
    result += `/${chord.bass}`;
  }
  return result;
}
