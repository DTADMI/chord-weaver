export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B";

export type Accidental = "#" | "b" | "n";

export type ChordQuality =
  | "maj"
  | "min"
  | "dim"
  | "aug"
  | "sus2"
  | "sus4"
  | "dom7"
  | "maj7"
  | "min7"
  | "dim7"
  | "aug7"
  | "m7b5"
  | "mMaj7"
  | "add9"
  | "madd9"
  | "dom9"
  | "dom13"
  | "6"
  | "m6";

export interface Chord {
  root: NoteName;
  quality: ChordQuality;
  bass?: NoteName;
  extension?: string;
  notes: NoteName[];
  confidence?: number;
  timestamp?: number;
  duration?: number;
}

export interface ChordProgression {
  key: string;
  timeSignature: [number, number];
  tempo: number;
  chords: Chord[];
  sections: Section[];
}

export interface Section {
  name: string;
  type: "verse" | "chorus" | "bridge" | "intro" | "outro" | "solo" | "instrumental";
  startBar: number;
  endBar: number;
}

export interface ChordSheet {
  id?: string;
  title: string;
  artist?: string;
  key?: string;
  tempo?: number;
  progression: ChordProgression;
  lyrics?: LyricLine[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface LyricLine {
  text: string;
  chords: Array<{ position: number; chord: string }>;
}
