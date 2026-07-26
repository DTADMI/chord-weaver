import type { Chord, NoteName, ChordQuality } from "@/lib/chords/types";

interface ChromaVector {
  c: number; cSharp: number; d: number; dSharp: number;
  e: number; f: number; fSharp: number; g: number;
  gSharp: number; a: number; aSharp: number; b: number;
}

const NOTE_KEYS: (keyof ChromaVector)[] = [
  "c", "cSharp", "d", "dSharp", "e", "f", "fSharp", "g", "gSharp", "a", "aSharp", "b",
];

const NOTE_NAMES: NoteName[] = [
  "C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B",
];

interface ChordTemplate {
  name: string;
  quality: ChordQuality;
  chroma: number[];
}

const CHORD_TEMPLATES: ChordTemplate[] = [
  { name: "maj", quality: "maj", chroma: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0] },
  { name: "min", quality: "min", chroma: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
  { name: "dim", quality: "dim", chroma: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0] },
  { name: "aug", quality: "aug", chroma: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
  { name: "sus4", quality: "sus4", chroma: [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0] },
  { name: "dom7", quality: "dom7", chroma: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0] },
  { name: "maj7", quality: "maj7", chroma: [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1] },
  { name: "min7", quality: "min7", chroma: [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0] },
];

export function computeChroma(buffer: AudioBuffer, timeStart = 0, timeEnd?: number): Float32Array {
  const fftSize = 4096;
  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(timeStart * sampleRate);
  const endSample = Math.floor((timeEnd ?? buffer.duration) * sampleRate);
  const segment = buffer.getChannelData(0).slice(startSample, endSample);
  const chroma = new Float32Array(12);

  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  const numFrames = Math.floor(segment.length / (fftSize / 2));

  for (let frame = 0; frame < numFrames; frame++) {
    for (let i = 0; i < fftSize; i++) {
      const idx = frame * (fftSize / 2) + i;
      if (idx < segment.length) {
        const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (fftSize - 1));
        real[i] = segment[idx] * window;
      } else {
        real[i] = 0;
      }
      imag[i] = 0;
    }
    fft(real, imag);
    for (let i = 0; i < fftSize / 2; i++) {
      const magnitude = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
      const frequency = (i * sampleRate) / fftSize;
      if (frequency < 65 || frequency > 2093) continue;
      const midiNote = 12 * Math.log(frequency / 440) / Math.log(2) + 69;
      const chromaBin = Math.round(midiNote) % 12;
      chroma[chromaBin] += magnitude;
    }
  }

  for (let i = 0; i < 12; i++) {
    chroma[i] = Math.log10(1 + chroma[i]);
  }

  const maxVal = Math.max(...chroma, 1e-10);
  for (let i = 0; i < 12; i++) {
    chroma[i] /= maxVal;
  }

  return chroma;
}

function fft(real: Float32Array, imag: Float32Array) {
  const n = real.length;
  if (n <= 1) return;
  const half = n >> 1;
  const evenReal = new Float32Array(half);
  const evenImag = new Float32Array(half);
  const oddReal = new Float32Array(half);
  const oddImag = new Float32Array(half);
  for (let i = 0; i < half; i++) {
    evenReal[i] = real[i * 2];
    evenImag[i] = imag[i * 2];
    oddReal[i] = real[i * 2 + 1];
    oddImag[i] = imag[i * 2 + 1];
  }
  fft(evenReal, evenImag);
  fft(oddReal, oddImag);
  for (let k = 0; k < half; k++) {
    const t = (-2 * Math.PI * k) / n;
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const re = oddReal[k] * cos - oddImag[k] * sin;
    const im = oddReal[k] * sin + oddImag[k] * cos;
    real[k] = evenReal[k] + re;
    imag[k] = evenImag[k] + im;
    real[k + half] = evenReal[k] - re;
    imag[k + half] = evenImag[k] - im;
  }
}

function cosineSimilarity(a: number[], b: Float32Array): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function detectChordFromChroma(chroma: Float32Array): Chord {
  let bestRoot = 0;
  let bestQuality = "maj" as ChordQuality;
  let bestScore = -1;

  for (let root = 0; root < 12; root++) {
    const rotated = new Float32Array(12);
    for (let i = 0; i < 12; i++) {
      rotated[i] = chroma[(i + root) % 12];
    }
    for (const template of CHORD_TEMPLATES) {
      const score = cosineSimilarity(template.chroma, rotated);
      if (score > bestScore) {
        bestScore = score;
        bestRoot = root;
        bestQuality = template.quality;
      }
    }
  }

  return {
    root: NOTE_NAMES[bestRoot],
    quality: bestQuality,
    notes: [],
    confidence: Math.max(0, Math.min(1, (bestScore + 1) / 2)),
  };
}

export function detectChords(audioBuffer: AudioBuffer, hopSize = 2): Chord[] {
  const duration = audioBuffer.duration;
  const chords: Chord[] = [];
  const segmentDuration = 1;
  let time = 0;

  while (time < duration) {
    const endTime = Math.min(time + segmentDuration, duration);
    const chroma = computeChroma(audioBuffer, time, endTime);
    const chord = detectChordFromChroma(chroma);
    chord.timestamp = time;
    chord.duration = endTime - time;
    chords.push(chord);
    time += hopSize;
  }

  return chords;
}
