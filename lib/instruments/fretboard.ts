import type { NoteName, Chord } from "@/lib/chords/types";
import { getFretboard } from "./guitar";

export interface FretboardDiagram {
  strings: number;
  frets: number;
  positions: Array<{
    string: number;
    fret: number;
    finger?: number;
    note: NoteName;
    isRoot: boolean;
  }>;
  barres: Array<{ fromString: number; toString: number; fret: number }>;
  tuning: string[];
}

export function getChordFretboard(
  chord: Chord,
  numFrets = 5,
  startFret = 0,
): FretboardDiagram | null {
  const fretboard = getFretboard(22);
  const chordNotes = new Set(chord.notes.map((n) => n.toUpperCase()));

  const positions: FretboardDiagram["positions"] = [];
  let barres: FretboardDiagram["barres"] = [];

  for (const stringFrets of fretboard) {
    const stringNum = stringFrets[0].string;
    let bestFret = -1;

    for (const pos of stringFrets) {
      if (pos.fret >= startFret && pos.fret <= startFret + numFrets && chordNotes.has(pos.note.toUpperCase())) {
        if (bestFret === -1 || pos.fret < bestFret) {
          bestFret = pos.fret;
        }
      }
    }

    if (bestFret >= 0) {
      const pos = stringFrets[bestFret];
      positions.push({
        string: pos.string,
        fret: pos.fret,
        note: pos.note,
        isRoot: pos.note.toUpperCase() === chord.root.toUpperCase(),
      });
    }
  }

  if (positions.length === 0) return null;

  const allSameFret = positions.length > 1 && positions.every((p) => p.fret === positions[0].fret);
  if (allSameFret && positions[0].fret > 0) {
    barres = [{
      fromString: Math.min(...positions.map((p) => p.string)),
      toString: Math.max(...positions.map((p) => p.string)),
      fret: positions[0].fret,
    }];
  }

  return {
    strings: 6,
    frets: numFrets + 1,
    positions,
    barres,
    tuning: ["E", "A", "D", "G", "B", "E"],
  };
}
