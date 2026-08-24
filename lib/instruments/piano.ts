import type { NoteName } from "@/lib/chords/types";

export interface PianoKey {
  note: NoteName;
  octave: number;
  midiNumber: number;
  isBlack: boolean;
  position: number;
}

export function getPianoKeys(minOctave = 2, maxOctave = 6): PianoKey[] {
  const notes: NoteName[] = ["C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B"];
  const blackKeys = new Set([1, 3, 6, 8, 10]);
  const keys: PianoKey[] = [];
  let position = 0;

  for (let octave = minOctave; octave <= maxOctave; octave++) {
    for (let noteIdx = 0; noteIdx < 12; noteIdx++) {
      const midiNumber = (octave + 1) * 12 + noteIdx;
      keys.push({
        note: notes[noteIdx],
        octave,
        midiNumber,
        isBlack: blackKeys.has(noteIdx),
        position,
      });
      if (!blackKeys.has(noteIdx)) position++;
    }
  }

  return keys;
}

export function getPianoRange(): { min: number; max: number } {
  return { min: 21, max: 108 };
}

export function midiNumberToNote(midi: number): { note: NoteName; octave: number } {
  const notes: NoteName[] = ["C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B"];
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return { note: notes[noteIndex], octave };
}

export function noteToMidiNumber(note: NoteName, octave: number): number {
  const semitones: Record<string, number> = {
    C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5,
    "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
  };
  return (octave + 1) * 12 + (semitones[note] ?? 0);
}
