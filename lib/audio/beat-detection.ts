export interface BeatResult {
  timestamps: number[];
  tempo: number;
  confidence: number;
  timeSignature: [number, number];
}

export function detectBeats(buffer: AudioBuffer): BeatResult {
  const channelData = buffer.getChannelData(0);
  const sampleRate = buffer.sampleRate;
  const windowSize = 1024;
  const hopSize = 512;
  const numFrames = Math.floor((channelData.length - windowSize) / hopSize);

  const onsetStrength = new Float32Array(numFrames);
  let prevEnergy = 0;

  for (let i = 0; i < numFrames; i++) {
    const start = i * hopSize;
    let energy = 0;
    for (let j = 0; j < windowSize; j++) {
      if (start + j < channelData.length) {
        energy += channelData[start + j] * channelData[start + j];
      }
    }
    energy /= windowSize;
    onsetStrength[i] = Math.max(0, energy - prevEnergy);
    prevEnergy = energy;
  }

  const correlation = new Float32Array(numFrames / 2);
  for (let lag = 1; lag < numFrames / 2; lag++) {
    let sum = 0;
    for (let i = 0; i < numFrames - lag; i++) {
      sum += onsetStrength[i] * onsetStrength[i + lag];
    }
    correlation[lag] = sum / (numFrames - lag);
  }

  let bestLag = 1;
  let bestCorrelation = 0;
  const minLag = Math.floor(60 / 200 * sampleRate / hopSize);
  const maxLag = Math.ceil(60 / 40 * sampleRate / hopSize);

  for (let lag = minLag; lag < Math.min(maxLag, correlation.length); lag++) {
    if (correlation[lag] > bestCorrelation) {
      bestCorrelation = correlation[lag];
      bestLag = lag;
    }
  }

  const tempo = bestLag > 0 ? Math.round(60 * sampleRate / (hopSize * bestLag)) : 120;
  const beatInterval = bestLag * hopSize / sampleRate;
  const timestamps: number[] = [];
  let maxOnset = 0;
  let onsetThreshold = 0;

  for (let i = 0; i < onsetStrength.length; i++) {
    if (onsetStrength[i] > maxOnset) maxOnset = onsetStrength[i];
  }
  onsetThreshold = maxOnset * 0.3;

  let nextBeatTime = 0;
  for (let i = 0; i < onsetStrength.length; i++) {
    const time = (i * hopSize) / sampleRate;
    if (onsetStrength[i] > onsetThreshold && time >= nextBeatTime) {
      timestamps.push(time);
      nextBeatTime = time + beatInterval * 0.8;
    }
  }

  return {
    timestamps,
    tempo: Math.max(40, Math.min(200, tempo)),
    confidence: bestCorrelation,
    timeSignature: [4, 4],
  };
}
