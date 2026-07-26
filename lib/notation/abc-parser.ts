import type { ChordSheet, Chord } from "@/lib/chords/types";

export function parseAbcNotation(abc: string): ChordSheet | null {
  try {
    const titleMatch = abc.match(/^T:(.+)$/m);
    const keyMatch = abc.match(/^K:(.+)$/m);
    const meterMatch = abc.match(/^M:(\d+)\/(\d+)$/m);
    const tempoMatch = abc.match(/^Q:(\d+)/m);

    const title = titleMatch?.[1]?.trim() ?? "Untitled";
    const key = keyMatch?.[1]?.trim();
    const timeSignature: [number, number] = meterMatch
      ? [parseInt(meterMatch[1]), parseInt(meterMatch[2])]
      : [4, 4];
    const tempo = tempoMatch ? parseInt(tempoMatch[1]) : 120;

    const body = abc.split(/\n/).filter((l) => !l.match(/^[A-Z]:/)).join(" ");
    const chordMatches = body.match(/\"([A-Z][#b]?[mM]?\d*[a-zA-Z]?)\"/g) ?? [];
    const chords: Chord[] = chordMatches.map((c, i) => ({
      root: (c.replace(/"/g, "").charAt(0).toUpperCase() + c.replace(/"/g, "").slice(1)) as Chord["root"],
      quality: "maj",
      notes: [],
      timestamp: i * 2,
      duration: 2,
    }));

    return {
      title,
      key: key ?? undefined,
      progression: {
        key: key ?? "C",
        timeSignature,
        tempo,
        chords,
        sections: [],
      },
    };
  } catch {
    return null;
  }
}

export function toAbcNotation(sheet: ChordSheet): string {
  const { default: chordToString } = require("@/lib/chords/database");
  const key = sheet.progression.key;
  const timeSig = sheet.progression.timeSignature;
  const tempo = sheet.progression.tempo;

  let abc = `X:1\n`;
  abc += `T:${sheet.title}\n`;
  abc += `M:${timeSig[0]}/${timeSig[1]}\n`;
  abc += `L:1/4\n`;
  abc += `Q:${tempo}\n`;
  abc += `K:${key}\n\n`;

  let line = "";
  for (const chord of sheet.progression.chords) {
    line += `"${chordToString(chord)}"C `;
  }
  abc += line.trim();

  return abc;
}
