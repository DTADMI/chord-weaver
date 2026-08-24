import type { Chord, ChordSheet } from "@/lib/chords/types";
import { chordToString } from "@/lib/chords/database";

export interface RenderOptions {
  width: number;
  height: number;
  fontSize: number;
  includeFingerings: boolean;
}

export function generateVexFlowCode(sheet: ChordSheet, options?: Partial<RenderOptions>): string {
  const opts: RenderOptions = {
    width: options?.width ?? 800,
    height: options?.height ?? 400,
    fontSize: options?.fontSize ?? 14,
    includeFingerings: options?.includeFingerings ?? false,
  };

  const chords = sheet.progression.chords;
  const chordStrings = chords.map((c: Chord) => chordToString(c));

  return `
    const { Factory } = Vex.Flow;
    const vf = new Factory({ renderer: { elementId: 'vexflow-output', width: ${opts.width}, height: ${opts.height} } });
    const score = vf.EasyScore();
    const system = vf.System();

    const notes = [
      ${chordStrings.map((c: string, i: number) => `score.voice(score.notes('${c}/q', { stem: 'up' }))`).join(",\n      ")}
    ];

    system.addStave({ voices: notes }).addClef('treble').addTimeSignature('${sheet.progression.timeSignature[0]}/${sheet.progression.timeSignature[1]}');
    vf.draw();
  `;
}

export function generateChordPro(sheet: ChordSheet): string {
  let output = `{title:${sheet.title}}\n`;
  if (sheet.artist) output += `{artist:${sheet.artist}}\n`;
  if (sheet.key) output += `{key:${sheet.key}}\n`;
  output += `{tempo:${sheet.progression.tempo}}\n\n`;

  let line = "";
  let chordLine = "";
  for (const chord of sheet.progression.chords) {
    const chordStr = chordToString(chord);
    chordLine += chordStr.padEnd(8, " ");
    line += "".padEnd(8, " ");
  }
  output += chordLine + "\n" + line + "\n";

  return output;
}
