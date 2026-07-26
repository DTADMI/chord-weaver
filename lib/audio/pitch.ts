export interface PitchResult {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  confidence: number;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const A4_FREQUENCY = 440;

export function frequencyToNote(freq: number): PitchResult {
  if (freq <= 0) {
    return { frequency: 0, note: "N/A", octave: 0, cents: 0, confidence: 0 };
  }
  const semitones = 12 * (Math.log(freq / A4_FREQUENCY) / Math.log(2));
  const roundedSemitones = Math.round(semitones);
  const cents = Math.round((semitones - roundedSemitones) * 100);
  const noteIndex = ((roundedSemitones % 12) + 12) % 12;
  const octave = 4 + Math.floor((roundedSemitones + 12) / 12) - 1;

  return {
    frequency: freq,
    note: NOTE_NAMES[noteIndex],
    octave: Math.max(0, octave),
    cents,
    confidence: Math.max(0, 1 - Math.abs(semitones - roundedSemitones)),
  };
}

export function autocorrelationPitchDetection(
  buffer: Float32Array,
  sampleRate: number,
): PitchResult {
  const minFreq = 65;
  const maxFreq = 2093;
  const minLag = Math.floor(sampleRate / maxFreq);
  const maxLag = Math.ceil(sampleRate / minFreq);
  let bestLag = 0;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - lag; i++) {
      correlation += buffer[i] * buffer[i + lag];
    }
    const energy = buffer.reduce((sum, v, i) => {
      if (i < buffer.length - lag) return sum + v * v;
      return sum;
    }, 0);
    const normalizedCorrelation = energy > 0 ? correlation / energy : 0;
    if (normalizedCorrelation > bestCorrelation) {
      bestCorrelation = normalizedCorrelation;
      bestLag = lag;
    }
  }

  if (bestLag === 0) {
    return { frequency: 0, note: "N/A", octave: 0, cents: 0, confidence: 0 };
  }

  const frequency = sampleRate / bestLag;
  const result = frequencyToNote(frequency);
  result.confidence = Math.min(1, bestCorrelation);
  return result;
}

export function detectPitchFFT(buffer: Float32Array, sampleRate: number): PitchResult {
  const fftSize = 2048;
  if (buffer.length < fftSize) {
    return autocorrelationPitchDetection(buffer, sampleRate);
  }
  const real = new Float32Array(fftSize);
  const imag = new Float32Array(fftSize);
  for (let i = 0; i < fftSize; i++) {
    const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (fftSize - 1));
    real[i] = buffer[i] * window;
  }
  fft(real, imag);
  const magnitudes = new Float32Array(fftSize / 2);
  for (let i = 0; i < fftSize / 2; i++) {
    magnitudes[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
  }
  let peakIndex = 1;
  let peakMagnitude = 0;
  for (let i = 1; i < fftSize / 2; i++) {
    if (magnitudes[i] > peakMagnitude) {
      peakMagnitude = magnitudes[i];
      peakIndex = i;
    }
  }
  const frequency = (peakIndex * sampleRate) / fftSize;
  const result = frequencyToNote(frequency);
  result.confidence = Math.min(1, peakMagnitude / (buffer.length * 0.5));
  return result;
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
