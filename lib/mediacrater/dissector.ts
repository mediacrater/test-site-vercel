// lib/mediacrater/dissector.ts
//
// Direct port of the Chrome extension's utils/dissector.js.
// This file has zero chrome.* dependencies in the original — it's pure
// DOM/Canvas/Web Audio APIs — so behavior here is intentionally identical
// to the extension, frame-for-frame, so scan results don't drift between
// the two clients.

export interface ExtractedFrame {
  frameNumber: number;
  timestamp: string;
  timestampSeconds: number;
  data: string; // base64 JPEG data URL
}

export interface ExtractedAudio {
  data: string; // base64 WAV
  mimeType: string;
}

export type ScanType = 'regular' | 'deep';

const SCAN_CONFIG: Record<ScanType, { interval: number }> = {
  regular: { interval: 0.5 },
  deep: { interval: 0.125 },
};

const TARGET_LONG_EDGE = 900;

// Audio is downmixed to mono and resampled to this rate before WAV
// encoding. Speech intelligibility doesn't need the 44.1/48kHz stereo a
// browser decodes source video at — 16kHz mono is the standard rate for
// speech-focused model input and keeps a full 121s clip's base64 payload
// under ~5MB regardless of the source video's original audio format,
// instead of the 25-30MB+ a stereo 44.1kHz WAV would produce at that
// length. This does not change Gemini's token cost (audio tokens are
// billed by duration, not file size) — it exists purely to keep the
// request payload within the same size budget the frame payload already
// respects.
const TARGET_AUDIO_SAMPLE_RATE = 16000;

export async function extractFrames(
  videoFile: File,
  signal: AbortSignal | null | undefined,
  scanType: ScanType = 'regular'
): Promise<ExtractedFrame[]> {
  return extractFramesCanvas(videoFile, signal, scanType);
}

function extractFramesCanvas(
  videoFile: File,
  signal: AbortSignal | null | undefined,
  scanType: ScanType
): Promise<ExtractedFrame[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas 2D context unavailable in this browser'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(videoFile);

    video.addEventListener('loadedmetadata', async () => {
      const duration = video.duration;

      // Scale based on the video's longest edge, preserving aspect ratio.
      // Handles landscape, portrait, and square videos without distortion.
      // Never scale up if the video is already smaller.
      const longestEdge = Math.max(video.videoWidth, video.videoHeight);
      const scale = longestEdge > TARGET_LONG_EDGE ? TARGET_LONG_EDGE / longestEdge : 1;
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);

      const orientation =
        video.videoWidth > video.videoHeight
          ? 'landscape'
          : video.videoWidth < video.videoHeight
          ? 'portrait'
          : 'square';

      console.log(
        `[${scanType} scan] Source: ${video.videoWidth}×${video.videoHeight} (${orientation}) → Output: ${canvas.width}×${canvas.height}`
      );

      const config = SCAN_CONFIG[scanType] || SCAN_CONFIG.regular;
      const interval = config.interval;
      const frames: ExtractedFrame[] = [];
      const timestamps: number[] = [];

      for (let time = 0; time < duration; time += interval) {
        timestamps.push(time);
      }

      console.log(`[${scanType} scan] Deconstructing video with ${duration.toFixed(1)}s duration`);

      let frameNumber = 1;

      for (const time of timestamps) {
        if (signal && signal.aborted) {
          URL.revokeObjectURL(video.src);
          reject(new Error('Operation cancelled'));
          return;
        }

        try {
          await seekToTime(video, time);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.15);

          frames.push({
            frameNumber,
            timestamp: formatTimestamp(time),
            timestampSeconds: time,
            data: dataUrl,
          });

          frameNumber++;
        } catch (error) {
          console.warn(`Failed to extract frame at ${time.toFixed(2)}s:`, error);
        }
      }

      URL.revokeObjectURL(video.src);

      if (frames.length === 0) {
        reject(new Error('No frames could be extracted from the video'));
        return;
      }

      console.log(`Successfully extracted ${frames.length} frames`);
      resolve(frames);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(video.src);
      const errorMessage = getVideoErrorMessage(video.error);
      reject(new Error(`Failed to load video: ${errorMessage}`));
    });
  });
}

function seekToTime(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Seek timeout at ${time}s`));
    }, 10000);

    const seekedHandler = () => {
      clearTimeout(timeoutId);
      video.removeEventListener('seeked', seekedHandler);
      video.removeEventListener('error', errorHandler);
      setTimeout(resolve, 50);
    };

    const errorHandler = () => {
      clearTimeout(timeoutId);
      video.removeEventListener('seeked', seekedHandler);
      video.removeEventListener('error', errorHandler);
      reject(new Error(`Seek failed at ${time}s`));
    };

    video.addEventListener('seeked', seekedHandler);
    video.addEventListener('error', errorHandler);
    video.currentTime = time;
  });
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function getVideoErrorMessage(error: MediaError | null): string {
  if (!error) return 'Unknown error';

  switch (error.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return 'Video loading was aborted';
    case MediaError.MEDIA_ERR_NETWORK:
      return 'Network error while loading video';
    case MediaError.MEDIA_ERR_DECODE:
      return 'Video format not supported or file is corrupted';
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return 'Video format not supported';
    default:
      return error.message || 'Unknown error';
  }
}

/**
 * Extracts audio from a video file as a base64-encoded WAV blob.
 * Downmixed to mono and resampled to TARGET_AUDIO_SAMPLE_RATE (see
 * comment above) to keep the payload small regardless of source format.
 */
export async function extractAudio(videoFile: File): Promise<ExtractedAudio | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const AudioContextCtor =
          window.AudioContext || (window as any).webkitAudioContext;

        // Decode at native rate first — decodeAudioData doesn't accept a
        // target sample rate directly, so we decode, then resample+downmix
        // in a second pass via OfflineAudioContext below.
        const decodeCtx = new AudioContextCtor();
        let decodedBuffer: AudioBuffer;
        try {
          decodedBuffer = await decodeCtx.decodeAudioData(arrayBuffer);
        } catch {
          decodeCtx.close();
          resolve(null);
          return;
        }
        decodeCtx.close();

        const monoBuffer = await downmixAndResample(decodedBuffer, TARGET_AUDIO_SAMPLE_RATE);

        const wavBuffer = audioBufferToWav(monoBuffer);
        const uint8 = new Uint8Array(wavBuffer);
        let binary = '';
        for (let i = 0; i < uint8.length; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binary);

        resolve({ data: base64, mimeType: 'audio/wav' });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read video file for audio extraction'));
    reader.readAsArrayBuffer(videoFile);
  });
}

/**
 * Downmixes to mono and resamples to targetSampleRate using
 * OfflineAudioContext. A mono-channel OfflineAudioContext destination
 * downmixes multi-channel source audio automatically as part of the
 * audio graph's own routing (native, off-main-thread rendering) — no
 * manual per-sample mixing loop is needed or should be added here.
 * A hand-rolled sample loop was tried in an earlier version of this
 * function and caused multi-second main-thread blocking (observed as
 * page freezes in the web app) for longer clips; do not reintroduce it.
 */
async function downmixAndResample(
  audioBuffer: AudioBuffer,
  targetSampleRate: number
): Promise<AudioBuffer> {
  const duration = audioBuffer.duration;
  const OfflineCtor =
    (window as any).OfflineAudioContext || (window as any).webkitOfflineAudioContext;

  const offlineCtx = new OfflineCtor(
    1, // mono output — the context automatically downmixes multi-channel input to this
    Math.ceil(duration * targetSampleRate),
    targetSampleRate
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  return offlineCtx.startRendering();
}

function audioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numChannels = audioBuffer.numberOfChannels; // always 1 post-downmix
  const sampleRate = audioBuffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const samples = audioBuffer.length * numChannels;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, samples * 2, true);

  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return buffer;
}
