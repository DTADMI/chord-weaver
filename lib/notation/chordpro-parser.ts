import type { ChordSheet, Chord, ChordProgression } from "@/lib/chords/types";

export function parseChordPro(text: string): ChordSheet | null {
  try {
    const titleMatch = text.match(/\{title:\s*(.+?)\}/i);
    const artistMatch = text.match(/\{artist:\s*(.+?)\}/i);
    const keyMatch = text.match(/\{key:\s*(.+?)\}/i);
    const tempoMatch = text.match(/\{tempo:\s*(\d+)\}/i);

    const title = titleMatch?.[1]?.trim() ?? "Untitled";
    const artist = artistMatch?.[1]?.trim();
    const key = keyMatch?.[1]?.trim() ?? "C";
    const tempo = tempoMatch ? parseInt(tempoMatch[1]) : 120;

    const chordRegex = /\[([A-G][#b]?(?:m|maj|min|dim|aug|sus[24]|dom|add\d|[mM]?\d+)*)\]/g;
    const chordMatches = [...text.matchAll(chordRegex)];
    const chords: Chord[] = chordMatches.map((m, i) => ({
      root: m[1].replace(/[mM].*$/, "") as Chord["root"],
      quality: m[1].includes("m") && !m[1].includes("maj") ? "min" : "maj",
      notes: [],
      timestamp: i * 2,
      duration: 2,
    }));

    const progression: ChordProgression = {
      key,
      timeSignature: [4, 4],
      tempo,
      chords,
      sections: [],
    };

    return { title, artist, key, progression };
  } catch {
    return null;
  }
}

export function toChordPro(sheet: ChordSheet): string {
  const { chordToString } = require("@/lib/chords/database");
  let output = `{title: ${sheet.title}}\n`;
  if (sheet.artist) output += `{artist: ${sheet.artist}}\n`;
  output += `{key: ${sheet.progression.key}}\n`;
  output += `{tempo: ${sheet.progression.tempo}}\n\n`;

  let line = "";
  let chordLine = "";
  for (const chord of sheet.progression.chords) {
    const chordStr = chordToString(chord);
    chordLine += `[${chordStr}]`;
    line += "".padEnd(chordStr.length + 2, " ");
  }
  output += chordLine + "\n" + line + "\n";

  return output;
}
