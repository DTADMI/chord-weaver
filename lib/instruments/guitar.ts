import type { NoteName } from "@/lib/chords/types";

export interface GuitarString {
  string: number;
  note: NoteName;
  octave: number;
  midiNumber: number;
  frequency: number;
}

export interface FretPosition {
  string: number;
  fret: number;
  note: NoteName;
  octave: number;
  midiNumber: number;
}

const STANDARD_TUNING: Array<{ note: NoteName; octave: number }> = [
  { note: "E", octave: 2 },
  { note: "A", octave: 2 },
  { note: "D", octave: 3 },
  { note: "G", octave: 3 },
  { note: "B", octave: 3 },
  { note: "E", octave: 4 },
];

const A4 = 440;

function noteToFrequency(note: NoteName, octave: number): number {
  const semitones: Record<string, number> = {
    C: -9, "C": -8, D: -7, "D": -6, E: -5,
    F: -4, "F": -3, G: -2, "G": -1, A: 0, "A": 1, B: 2,
  };
  const s = (semitones[note] ?? 0) + (octave - 4) * 12;
  return A4 * Math.pow(2, s / 12);
}

export function getGuitarTuning(): GuitarString[] {
  return STANDARD_TUNING.map((t, i) => ({
    string: 6 - i,
    note: t.note,
    octave: t.octave,
    midiNumber: (t.octave + 1) * 12 + getNoteSemitone(t.note),
    frequency: noteToFrequency(t.note, t.octave),
  }));
}

function getNoteSemitone(note: NoteName): number {
  const map: Record<string, number> = {
    C: 0, "C": 1, D: 2, "D": 3, E: 4, F: 5,
    "F": 6, G: 7, "G": 8, A: 9, "A": 10, B: 11,
  };
  return map[note] ?? 0;
}

export function getFretboard(numFrets = 22): FretPosition[][] {
  const tuning = getGuitarTuning();
  return tuning.map((guitarString) => {
    const positions: FretPosition[] = [];
    const notes: NoteName[] = ["C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B"];
    const baseSemitone = getNoteSemitone(guitarString.note);
    const baseOctave = guitarString.octave;

    for (let fret = 0; fret <= numFrets; fret++) {
      const semitone = baseSemitone + fret;
      const noteIndex = semitone % 12;
      const octaveOffset = Math.floor(semitone / 12);
      positions.push({
        string: guitarString.string,
        fret,
        note: notes[noteIndex],
        octave: baseOctave + octaveOffset,
        midiNumber: (baseOctave + octaveOffset + 1) * 12 + noteIndex,
      });
    }
    return positions;
  });
}
