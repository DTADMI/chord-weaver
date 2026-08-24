import type { Chord, NoteName } from "@/lib/chords/types";
import { getChordNotes } from "@/lib/chords/database";

const A4 = 440;

function noteToFrequency(note: NoteName, octave = 4): number {
  const noteSemitones: Record<string, number> = {
    C: -9, "C#": -8, D: -7, "D#": -6, E: -5,
    F: -4, "F#": -3, G: -2, "G#": -1, A: 0, "A#": 1, B: 2,
  };
  const semitones = (noteSemitones[note] ?? 0) + (octave - 4) * 12;
  return A4 * Math.pow(2, semitones / 12);
}

export function synthesizeChord(
  chord: Chord,
  duration = 2,
  sampleRate = 44100,
): Float32Array {
  const notes = chord.notes.length > 0 ? chord.notes : getChordNotes(chord.root, chord.quality);
  const numSamples = Math.floor(sampleRate * duration);
  const audioData = new Float32Array(numSamples);
  const numNotes = notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-3 * t / duration);
    let sample = 0;

    for (let n = 0; n < numNotes; n++) {
      const freq = noteToFrequency(notes[n], 4);
      sample += Math.sin(2 * Math.PI * freq * t) * envelope;
      sample += Math.sin(2 * Math.PI * freq * 2 * t) * envelope * 0.3;
      sample += Math.sin(2 * Math.PI * freq * 3 * t) * envelope * 0.1;
    }

    audioData[i] = sample / numNotes;
  }

  return audioData;
}

export function synthesizeProgression(
  chords: Chord[],
  tempo = 120,
  sampleRate = 44100,
): Float32Array {
  const beatsPerChord = 4;
  const secondsPerBeat = 60 / tempo;
  const chordDuration = beatsPerChord * secondsPerBeat;
  const totalSamples = Math.floor(
    chords.reduce((sum, _, i) => sum + chordDuration, 0) * sampleRate,
  );
  const audioData = new Float32Array(totalSamples);
  let offset = 0;

  for (const chord of chords) {
    const chordData = synthesizeChord(chord, chordDuration, sampleRate);
    for (let i = 0; i < chordData.length && offset + i < totalSamples; i++) {
      audioData[offset + i] = chordData[i];
    }
    offset += chordData.length;
  }

  return audioData;
}

export function float32ToWav(
  audioData: Float32Array,
  sampleRate = 44100,
): Blob {
  const numChannels = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = audioData.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < audioData.length; i++) {
    const sample = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
