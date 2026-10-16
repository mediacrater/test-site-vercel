// lib/mediacrater/scanApi.ts
//
// Talks to the exact same VPS endpoints the extension's utils/supabase.js
// calls (/scan-video, /scan-image, /queue-status, /queue-cancel,
// /queue-timing) — same auth model (Supabase JWT via Authorization header),
// same queueing/rate-limit/abuse-lock behavior server-side, since it's the
// same server code (routes/scanVideo.js, routes/scanImage.js) handling both
// origins. The only difference on the wire is the `x-scan-origin: webapp`
// header, which is what server.js's origin-detection logic in
// scanVideo.js/scanImage.js uses to tag the `origin` column on `scans`.
//
// NOTE: the extension's scanVideo() took a `policy` argument positionally
// that was never actually used (server loads the policy itself from
// `platform`). Dropped here rather than ported as dead weight.
//
// VIDEO UPLOAD: videos up to MAX_VIDEO_UPLOAD_BYTES are uploaded once with
// uploadVideo() and scanned by reference ({ uploadId }); the server hands the
// AI a signed URL to the file instead of browser-extracted frames. Bigger
// files still go through the frame path ({ frames }), since Cloudflare's free
// plan rejects request bodies over 100 MB.

import type { ExtractedFrame, ScanType } from './dissector';
import { supabase } from './supabaseClient';
import { isGatewayTimeout, isLostConnection, SCAN_LOST_MESSAGE, waitForSavedScan } from './scanRecovery';

const VPS_URL = process.env.NEXT_PUBLIC_VPS_API_URL || '';

export interface ScanQueuedResponse {
  queued: true;
  jobId: string;
  position: number;
}

export interface ScanCompletedResponse {
  queued?: false;
  success: true;
  result: {
    platform: string;
    violations: Array<Record<string, unknown>>;
  };
  scansRemaining: number;
  maxScans: number;
  plan: string;
}

export type ScanResponse = ScanQueuedResponse | ScanCompletedResponse;

// Must match MAX_UPLOAD_BYTES in the VPS routes/uploadVideo.js.
export const MAX_VIDEO_UPLOAD_BYTES = 95 * 1024 * 1024;

export type VideoScanInput =
  | { uploadId: string }
  | { frames: ExtractedFrame[] };

export interface UploadedVideo {
  uploadId: string;
  durationSeconds: number | null;
}

export interface ClientBatchMeta {
  batchedByClient: boolean;
  batchId: string | null;
  batchPosition: number | null;
}

async function requireAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }
  return session.access_token;
}

/**
 * Extracts a usable error message from a non-OK VPS response the same
 * way the extension's error taxonomy in popup.js expects to match against
 * (e.g. "Insufficient tokens", "ACCOUNT_FLAGGED", "Rate limit exceeded").
 */
function errorMessageFromBody(status: number, data: any, fallback: string): string {
  if (!data || typeof data !== 'object') return fallback;
  if (status === 403 && data.error === 'ACCOUNT_FLAGGED') {
    return data.message || 'ACCOUNT_FLAGGED';
  }
  if (status === 402) {
    return `Insufficient tokens. You need ${data.tokensNeeded ?? 1} token(s).`;
  }
  if (status === 429) {
    return data.message || 'Rate limit exceeded';
  }
  return data.message || data.error || fallback;
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    return errorMessageFromBody(response.status, data, fallback);
  } catch {
    return fallback;
  }
}

const UPLOAD_ID_PATTERN = /^[a-f0-9]{48}$/;

/**
 * Uploads a video file to the VPS for an upload-based scan. Uses
 * XMLHttpRequest because fetch() has no upload progress events. The body is
 * the raw file (no base64), so a 95 MB file is sent as 95 MB.
 */
export async function uploadVideo(
  file: File,
  signal?: AbortSignal,
  onProgress?: (percent: number) => void
): Promise<UploadedVideo> {
  if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
    throw new Error('This video is over 95 MB. Please compress it and try again.');
  }

  const token = await requireAccessToken();

  return new Promise<UploadedVideo>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const onAbort = () => xhr.abort();

    const finish = () => signal?.removeEventListener('abort', onAbort);

    xhr.open('POST', `${VPS_URL}/upload-video`);
    xhr.withCredentials = true;
    xhr.responseType = 'text';
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('x-scan-origin', 'webapp');

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      }
    };

    xhr.onload = () => {
      finish();
      let data: any = null;
      try {
        data = JSON.parse(xhr.responseText || 'null');
      } catch {
        data = null;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        if (data && typeof data.uploadId === 'string' && UPLOAD_ID_PATTERN.test(data.uploadId)) {
          resolve({
            uploadId: data.uploadId,
            durationSeconds: typeof data.durationSeconds === 'number' ? data.durationSeconds : null,
          });
        } else {
          reject(new Error('Upload failed. Please try again.'));
        }
        return;
      }

      if (xhr.status === 413) {
        reject(new Error('This video is over 95 MB. Please compress it and try again.'));
        return;
      }

      reject(new Error(errorMessageFromBody(xhr.status, data, `Upload failed (${xhr.status})`)));
    };

    xhr.onerror = () => {
      finish();
      reject(new Error('Upload failed. Please check your connection and try again.'));
    };

    xhr.onabort = () => {
      finish();
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort, { once: true });
    xhr.send(file);
  });
}

/**
 * Best-effort cleanup for an upload that was never scanned (cancelled while
 * queued, or the scan request failed before reaching the server). The server
 * refuses to delete a file a scan is using, and deletes every upload when
 * its scan finishes, so this is never required for correctness.
 */
export async function deleteUploadedVideo(uploadId: string): Promise<void> {
  if (!UPLOAD_ID_PATTERN.test(uploadId)) return;
  try {
    const token = await requireAccessToken();
    await fetch(`${VPS_URL}/upload-video/${encodeURIComponent(uploadId)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
      keepalive: true,
    });
  } catch (err) {
    console.warn('Failed to delete uploaded video:', err);
  }
}

export async function scanVideo(
  video: VideoScanInput,
  audio: { data: string; mimeType: string } | null,
  platform: string,
  scanType: ScanType,
  jobId: string | null,
  signal?: AbortSignal,
  scanId?: string | null,
  thumbnailUrl?: string | null,
  fileName?: string | null,
  batchMeta?: ClientBatchMeta
): Promise<ScanResponse> {
  const token = await requireAccessToken();

  // Deep scans can outlast Cloudflare's 100-second limit. If the connection
  // is lost, the server still finishes and saves the scan under scanId, so we
  // wait for it instead of reporting "Failed to fetch" (see scanRecovery.ts).
  const recover = async (error: unknown): Promise<ScanResponse> => {
    if (signal?.aborted) throw error;
    if (scanId) return waitForSavedScan(scanId, signal);
    throw new Error(SCAN_LOST_MESSAGE);
  };

  let response: Response;
  try {
    response = await fetch(`${VPS_URL}/scan-video`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-scan-origin': 'webapp',
    },
    body: JSON.stringify({
      ...('uploadId' in video ? { uploadId: video.uploadId } : { frames: video.frames }),
      audio: audio || null,
      transcript: null,
      platform,
      scanType: scanType || 'regular',
      jobId: jobId || null,
      scanId: scanId || null,
      thumbnailUrl: thumbnailUrl || null,
      fileName: fileName || null,
      batchedByClient:
        batchMeta?.batchedByClient === true,
      batchId:
        batchMeta?.batchId ?? null,
      batchPosition:
        batchMeta?.batchPosition ?? null,
    }),
    signal,
    });
  } catch (error) {
    if (isLostConnection(error)) return recover(error);
    throw error;
  }

  if (response.status === 202) {
    const data = await response.json();
    return { queued: true, jobId: data.jobId, position: data.position };
  }

  if (!response.ok) {
    if (isGatewayTimeout(response.status)) {
      return recover(new Error(`Failed to scan video (${response.status})`));
    }
    throw new Error(await readErrorMessage(response, `Failed to scan video (${response.status})`));
  }

  try {
    return await response.json();
  } catch (error) {
    // The connection dropped while the result was arriving.
    return recover(error);
  }
}

export async function scanImage(
  imageData: string,
  platform: string,
  jobId: string | null,
  signal?: AbortSignal,
  scanId?: string | null,
  thumbnailUrl?: string | null,
  fileName?: string | null,
  batchMeta?: ClientBatchMeta
): Promise<ScanResponse> {
  const token = await requireAccessToken();

  // Same recovery as scanVideo: if the connection is lost, wait for the saved
  // scan instead of showing "Failed to fetch".
  const recover = async (error: unknown): Promise<ScanResponse> => {
    if (signal?.aborted) throw error;
    if (scanId) return waitForSavedScan(scanId, signal);
    throw new Error(SCAN_LOST_MESSAGE);
  };

  let response: Response;
  try {
    response = await fetch(`${VPS_URL}/scan-image`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-scan-origin': 'webapp',
    },
    body: JSON.stringify({
      imageData,
      platform,
      jobId: jobId || null,
      scanId: scanId || null,
      thumbnailUrl: thumbnailUrl || null,
      fileName: fileName || null,
      batchedByClient:
        batchMeta?.batchedByClient === true,
      batchId:
        batchMeta?.batchId ?? null,
      batchPosition:
        batchMeta?.batchPosition ?? null,
    }),
    signal,
    });
  } catch (error) {
    if (isLostConnection(error)) return recover(error);
    throw error;
  }

  if (response.status === 202) {
    const data = await response.json();
    return { queued: true, jobId: data.jobId, position: data.position };
  }

  if (!response.ok) {
    if (isGatewayTimeout(response.status)) {
      return recover(new Error(`Failed to scan image (${response.status})`));
    }
    throw new Error(await readErrorMessage(response, `Failed to scan image (${response.status})`));
  }

  try {
    return await response.json();
  } catch (error) {
    // The connection dropped while the result was arriving.
    return recover(error);
  }
}

export async function getQueueStatus(
  jobId: string
): Promise<{ status: 'running' | 'queued' | 'not_found'; position?: number }> {
  const token = await requireAccessToken();
  const response = await fetch(`${VPS_URL}/queue-status/${encodeURIComponent(jobId)}`, {
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to get queue status');
  return response.json();
}

export async function cancelQueuedScan(jobId: string): Promise<{ success: boolean }> {
  const token = await requireAccessToken();
  const response = await fetch(`${VPS_URL}/queue-cancel/${encodeURIComponent(jobId)}`, {
    method: 'POST',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel scan');
  }
  return response.json();
}

export async function reportQueueTiming(
  jobId: string,
  timings: { totalTimeMs: number; queueWaitMs: number; framesWaitMs: number }
): Promise<void> {
  try {
    const token = await requireAccessToken();
    await fetch(`${VPS_URL}/queue-timing/${encodeURIComponent(jobId)}`, {
      method: 'POST',
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(timings),
    });
  } catch (err) {
    // Non-critical, same as extension — never let timing reporting
    // break or delay the scan flow.
    console.warn('Failed to report queue timing:', err);
  }
}

/**
 * Polls /queue-status every 3s until the job is marked 'running'.
 * Resolves once it's the user's turn. Rejects with AbortError if
 * the signal is aborted (user cancelled).
 */
export function waitForQueueTurn(
  jobId: string,
  signal: AbortSignal,
  onPositionUpdate: (position: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      try {
        const status = await getQueueStatus(jobId);
        if (status.status === 'running') {
          resolve();
          return;
        }
        if (status.status === 'not_found') {
          reject(new Error('Your queued scan could not be found. Please try again.'));
          return;
        }
        if (typeof status.position === 'number') onPositionUpdate(status.position);
        setTimeout(checkStatus, 3000);
      } catch (err) {
        reject(err);
      }
    };
    checkStatus();
  });
}
