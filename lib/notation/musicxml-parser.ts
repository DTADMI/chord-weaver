import type { ChordSheet, Chord } from "@/lib/chords/types";

export function generateMusicXml(sheet: ChordSheet): string {
  const keyMap: Record<string, string> = {
    C: "0", G: "1", D: "2", A: "3", E: "4", B: "5", "F#": "6", "C#": "7",
    F: "-1", Bb: "-2", Eb: "-3", Ab: "-4", Db: "-5", Gb: "-6", Cb: "-7",
  };

  const fifths = keyMap[sheet.progression.key] ?? "0";
  const divisions = 4;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>${escapeXml(sheet.title)}</work-title>
  </work>
  <identification>
    <creator type="composer">${escapeXml(sheet.artist ?? "Unknown")}</creator>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>${escapeXml(sheet.title)}</part-name>
    </score-part>
  </part-list>
  <part id="P1">\n`;

  const measures = chunkArray(sheet.progression.chords, 4);
  for (let m = 0; m < measures.length; m++) {
    xml += `    <measure number="${m + 1}">
      <attributes>
        <divisions>${divisions}</divisions>
        <key>
          <fifths>${fifths}</fifths>
        </key>
        <time>
          <beats>${sheet.progression.timeSignature[0]}</beats>
          <beat-type>${sheet.progression.timeSignature[1]}</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>\n`;

    for (const chord of measures[m]) {
      xml += `      <note>
        <pitch>
          <step>${chord.root.charAt(0)}</step>
          ${chord.root.includes("#") || chord.root.includes("b") ? `<alter>${chord.root.includes("#") ? 1 : -1}</alter>` : ""}
          <octave>4</octave>
        </pitch>
        <duration>${divisions}</duration>
        <type>quarter</type>
        <notations>
          <harmony>
            <root>
              <root-step>${chord.root.charAt(0)}</root-step>
              ${chord.root.includes("#") || chord.root.includes("b") ? `<root-alter>${chord.root.includes("#") ? 1 : -1}</root-alter>` : ""}
            </root>
            <kind>${musicXmlKind(chord.quality)}</kind>
          </harmony>
        </notations>
      </note>\n`;
    }

    xml += `    </measure>\n`;
  }

  xml += `  </part>
</score-partwise>`;

  return xml;
}

function musicXmlKind(quality: string): string {
  const kinds: Record<string, string> = {
    maj: "major", min: "minor", dim: "diminished", aug: "augmented",
    dom7: "dominant", maj7: "major-seventh", min7: "minor-seventh",
    dim7: "diminished-seventh", sus4: "suspended-fourth", sus2: "suspended-second",
  };
  return kinds[quality] ?? "major";
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
