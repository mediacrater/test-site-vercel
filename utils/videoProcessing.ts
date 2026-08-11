const SCAN_CONFIG = {
  regular: { interval: 0.50 },
  deep: { interval: 0.125 }
} as const;

const TARGET_LONG_EDGE = 900;

export async function extractFrames(videoFile: File, signal: AbortSignal | null = null, scanType: string = 'regular') {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not supported'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(videoFile);

    video.addEventListener('loadedmetadata', async () => {
      const duration = video.duration;
      
      const longestEdge = Math.max(video.videoWidth, video.videoHeight);
      const scale = longestEdge > TARGET_LONG_EDGE ? TARGET_LONG_EDGE / longestEdge : 1;

      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);

      const config = SCAN_CONFIG[scanType as keyof typeof SCAN_CONFIG] || SCAN_CONFIG.regular;
      const interval = config.interval;

      const frames = [];
      const timestamps = [];
      
      for (let time = 0; time < duration; time += interval) {
        timestamps.push(time);
      }

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
            frameNumber: frameNumber,
            timestamp: formatTimestamp(time),
            timestampSeconds: time,
            data: dataUrl
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

function formatTimestamp(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

function getVideoErrorMessage(error: MediaError | null) {
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
