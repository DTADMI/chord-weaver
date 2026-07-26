import type { Chord } from "@/lib/chords/types";
import { getPianoVoicing, getGuitarVoicing } from "@/lib/chords/voicings";

export interface FingeringResult {
  instrument: "piano" | "guitar";
  chord: Chord;
  positions: Array<{
    note: string;
    string?: number;
    fret?: number;
    key?: number;
    finger?: number;
  }>;
  description: string;
}

export function getFingerings(chord: Chord): FingeringResult[] {
  const results: FingeringResult[] = [];

  const pianoVoicings = getPianoVoicing(chord);
  for (const voicing of pianoVoicings) {
    results.push({
      instrument: "piano",
      chord,
      positions: voicing.keys.map((key, i) => ({
        note: String(key),
        key,
        finger: voicing.fingers[i],
      })),
      description: `Piano ${chord.root}${chord.quality} (${voicing.hand} hand)`,
    });
  }

  const guitarVoicing = getGuitarVoicing(chord);
  if (guitarVoicing) {
    results.push({
      instrument: "guitar",
      chord,
      positions: guitarVoicing.strings.map((s) => ({
        note: chord.root,
        string: s.string,
        fret: s.fret,
        finger: s.finger,
      })),
      description: `Guitar ${chord.root}${chord.quality} (standard tuning)`,
    });
  }

  return results;
}
