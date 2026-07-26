export interface AudioInfo {
  duration: number;
  sampleRate: number;
  channels: number;
  format: string;
  size: number;
}

export function getAudioInfo(file: File): AudioInfo {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "unknown";
  return {
    duration: 0,
    sampleRate: 44100,
    channels: 2,
    format: ext,
    size: file.size,
  };
}

export function validateAudioFile(file: File): string | null {
  const validTypes = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/wave",
    "audio/ogg", "audio/flac", "audio/x-m4a", "audio/mp4"];
  const maxSize = 50 * 1024 * 1024;

  if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|flac|m4a)$/i)) {
    return "Unsupported audio format. Supported: MP3, WAV, OGG, FLAC, M4A";
  }
  if (file.size > maxSize) {
    return "File too large. Maximum size is 50 MB";
  }
  return null;
}

export async function decodeAudioFile(file: File): Promise<AudioBuffer | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    await audioContext.close();
    return audioBuffer;
  } catch {
    return null;
  }
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
