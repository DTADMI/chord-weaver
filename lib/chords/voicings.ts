import type { Chord, NoteName } from "./types";

export interface Voicing {
  strings: Array<{ fret: number; string: number; finger?: number }>;
  frets: number[];
  fingers: number[];
  barres: Array<{ fromString: number; toString: number; fret: number }>;
}

export interface PianoVoicing {
  keys: number[];
  fingers: number[];
  hand: "left" | "right";
}

const PIANO_CHORD_SHAPES: Record<string, number[][]> = {
  "C": [[0, 2, 4], [1, 3, 5], [4, 7, 11]],
  "Cm": [[0, 2, 3], [1, 3, 4], [4, 7, 10]],
  "D": [[2, 4, 6], [3, 5, 7], [6, 9, 13]],
  "Dm": [[2, 4, 5], [3, 5, 6], [6, 9, 12]],
  "E": [[4, 6, 8], [5, 7, 9], [8, 11, 15]],
  "Em": [[4, 6, 7], [5, 7, 8], [8, 11, 14]],
  "F": [[5, 7, 9], [6, 8, 10], [9, 12, 16]],
  "Fm": [[5, 7, 8], [6, 8, 9], [9, 12, 15]],
  "G": [[7, 9, 11], [8, 10, 12], [11, 14, 18]],
  "Gm": [[7, 9, 10], [8, 10, 11], [11, 14, 17]],
  "A": [[9, 11, 13], [10, 12, 14], [13, 16, 20]],
  "Am": [[9, 11, 12], [10, 12, 13], [13, 16, 19]],
  "B": [[11, 13, 15], [12, 14, 16], [15, 18, 22]],
  "Bm": [[11, 13, 14], [12, 14, 15], [15, 18, 21]],
};

export function getPianoVoicing(chord: Chord): PianoVoicing[] {
  const key = chord.root + (chord.quality === "min" ? "m" : "");
  const shapes = PIANO_CHORD_SHAPES[key] || [[0, 2, 4], [1, 3, 5]];
  return shapes.map((shape, i) => ({
    keys: shape,
    fingers: i === 0 ? [1, 3, 5] : [1, 2, 4, 5].slice(0, shape.length),
    hand: i < 2 ? "left" : "right",
  }));
}

export function getGuitarVoicing(chord: Chord): Voicing | null {
  const key = chord.root + (chord.quality === "min" ? "m" : "");
  const shapes: Record<string, Voicing> = {
    "C": { strings: [{ fret: 0, string: 1 }, { fret: 1, string: 2 }, { fret: 0, string: 3 }, { fret: 2, string: 4 }, { fret: 3, string: 5 }], frets: [-1, 0, 1, 0, 2, 3], fingers: [0, 0, 1, 0, 2, 3], barres: [] },
    "Cm": { strings: [{ fret: 3, string: 1 }, { fret: 1, string: 2 }, { fret: 0, string: 3 }, { fret: 2, string: 4 }, { fret: 3, string: 5 }], frets: [-1, 3, 1, 0, 2, 3], fingers: [0, 3, 1, 0, 2, 4], barres: [] },
    "D": { strings: [{ fret: 2, string: 1 }, { fret: 3, string: 2 }, { fret: 2, string: 3 }], frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], barres: [] },
    "Dm": { strings: [{ fret: 1, string: 1 }, { fret: 3, string: 2 }, { fret: 2, string: 3 }], frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], barres: [] },
    "E": { strings: [{ fret: 0, string: 1 }, { fret: 0, string: 2 }, { fret: 1, string: 3 }, { fret: 2, string: 4 }, { fret: 2, string: 5 }], frets: [0, 0, 0, 1, 2, 2], fingers: [0, 0, 0, 1, 2, 3], barres: [] },
    "Em": { strings: [{ fret: 0, string: 1 }, { fret: 0, string: 2 }, { fret: 0, string: 3 }, { fret: 2, string: 4 }, { fret: 2, string: 5 }], frets: [0, 0, 0, 0, 2, 2], fingers: [0, 0, 0, 0, 2, 3], barres: [] },
    "F": { strings: [{ fret: 1, string: 1 }, { fret: 1, string: 2 }, { fret: 2, string: 3 }, { fret: 3, string: 4 }, { fret: 3, string: 5 }], frets: [1, 1, 1, 2, 3, 3], fingers: [1, 1, 1, 2, 3, 4], barres: [{ fromString: 5, toString: 1, fret: 1 }] },
    "G": { strings: [{ fret: 3, string: 1 }, { fret: 0, string: 2 }, { fret: 0, string: 3 }, { fret: 0, string: 4 }, { fret: 2, string: 5 }], frets: [3, 0, 0, 0, 2, 3], fingers: [2, 0, 0, 0, 1, 3], barres: [] },
    "A": { strings: [{ fret: 0, string: 1 }, { fret: 2, string: 2 }, { fret: 2, string: 3 }, { fret: 2, string: 4 }, { fret: 0, string: 5 }], frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], barres: [] },
    "Am": { strings: [{ fret: 0, string: 1 }, { fret: 1, string: 2 }, { fret: 2, string: 3 }, { fret: 2, string: 4 }, { fret: 0, string: 5 }], frets: [-1, 0, 1, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], barres: [] },
  };
  return shapes[key] || null;
}
