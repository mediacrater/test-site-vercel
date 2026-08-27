self.onmessage = (e: MessageEvent<{
  sampleRate: number;
  channels: Float32Array[];
}>) => {
  const { sampleRate, channels } = e.data;
  const length = channels[0].length;
  const mono = new Float32Array(length);

  if (channels.length === 1) {
    mono.set(channels[0]);
  } else {
    const n = channels.length;
    for (let i = 0; i < length; i++) {
      let sum = 0;
      for (let ch = 0; ch < n; ch++) sum += channels[ch][i];
      mono[i] = sum / n;
    }
  }

  const wav = encodeWav(mono, sampleRate);
  self.postMessage({ data: arrayBufferToBase64(wav) });
};

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const pcm = new Int16Array(buffer, 44);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return buffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export {};
