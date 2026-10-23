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
// VIDEO UPLOAD: MP4/MOV videos up to MAX_VIDEO_UPLOAD_BYTES are uploaded once
// with uploadVideo(), straight to Cloudflare R2 through a presigned URL the
// VPS issues, and scanned by reference ({ uploadId }). The AI downloads the
// file from R2. WebM, bigger files, and any storage failure use the frame
// path ({ frames }) instead.

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
export const MAX_VIDEO_UPLOAD_BYTES = 500 * 1024 * 1024;

// What the browser removed (lib/mediacrater/metadataStrip.ts). The VPS checks
// the file itself; this only names what was cleared in its logs.
export interface MetadataReport {
  stripped: boolean;
  removed: string[];
}

export type VideoScanInput =
  | { uploadId: string; metadata?: MetadataReport }
  | { frames: ExtractedFrame[] };

/**
 * Thrown when temporary storage can't be used (not configured on the VPS,
 * R2 unreachable, upload rejected). The caller falls back to the frame path
 * instead of failing the scan.
 */
export class StorageUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}

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
 * Uploads a video for an upload-based scan, in two steps:
 *   1. The VPS checks the account (auth, lock, scans left, pending scan) and
 *      returns a presigned R2 URL valid 5 minutes for this exact size and type.
 *   2. The browser PUTs the file straight to R2 (XMLHttpRequest, for upload
 *      progress). The VPS never receives the video.
 * Account problems (limit reached, locked, scan in progress) throw a normal
 * Error with the server's message. Storage problems throw
 * StorageUnavailableError so the caller can use the frame path instead.
 */
export async function uploadVideo(
  file: Blob,
  contentType: string,
  signal?: AbortSignal,
  onProgress?: (percent: number) => void
): Promise<UploadedVideo> {
  if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
    throw new StorageUnavailableError('Video is over the upload limit');
  }

  const token = await requireAccessToken();

  const presign = await fetch(`${VPS_URL}/upload-video`, {
    method: 'POST',
    signal,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-scan-origin': 'webapp',
    },
    body: JSON.stringify({ size: file.size, contentType }),
  });

  if (!presign.ok) {
    let data: any = null;
    try {
      data = await presign.json();
    } catch {
      data = null;
    }
    if (presign.status === 503 || presign.status === 413 || presign.status === 415) {
      throw new StorageUnavailableError(data?.message || 'Video uploads are unavailable');
    }
    throw new Error(errorMessageFromBody(presign.status, data, `Upload failed (${presign.status})`));
  }

  const ticket = await presign.json();
  if (
    !ticket ||
    typeof ticket.uploadId !== 'string' ||
    !UPLOAD_ID_PATTERN.test(ticket.uploadId) ||
    typeof ticket.uploadUrl !== 'string' ||
    !/^https:\/\/[a-z0-9.-]+\.r2\.cloudflarestorage\.com\//i.test(ticket.uploadUrl)
  ) {
    throw new StorageUnavailableError('Unexpected upload ticket');
  }

  const uploadId: string = ticket.uploadId;

  try {
    await new Promise<void>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const onAbort = () => xhr.abort();
      const finish = () => signal?.removeEventListener('abort', onAbort);

      xhr.open('PUT', ticket.uploadUrl);
      // Must match the signed Content-Type exactly. No credentials and no
      // Authorization header: the URL itself is the permission.
      xhr.setRequestHeader('Content-Type', contentType);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
        }
      };
      xhr.onload = () => {
        finish();
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new StorageUnavailableError(`Storage rejected the upload (${xhr.status})`));
      };
      xhr.onerror = () => {
        finish();
        reject(new StorageUnavailableError('Could not reach storage'));
      };
      xhr.onabort = () => {
        finish();
        reject(new DOMException('Aborted', 'AbortError'));
      };

      signal?.addEventListener('abort', onAbort, { once: true });
      xhr.send(file);
    });
  } catch (error) {
    // Nothing usable was stored: release the server's record right away.
    void deleteUploadedVideo(uploadId);
    throw error;
  }

  return { uploadId, durationSeconds: null };
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
      ...('uploadId' in video
        ? { uploadId: video.uploadId, metadata: video.metadata ?? null }
        : { frames: video.frames }),
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
  batchMeta?: ClientBatchMeta,
  metadata?: MetadataReport
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
      metadata: metadata ?? null,
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
