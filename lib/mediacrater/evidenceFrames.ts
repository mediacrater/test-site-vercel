// lib/mediacrater/evidenceFrames.ts
//
// VIDEO UPLOAD: upload-based scans have no pre-extracted frames, so
// collectEvidenceFrames() captures a frame at each timestamp the model cited,
// straight from the local file (sharper than the old 0.30-quality frames).
// pickEvidenceFrames() is still used by the frame path (WebM, files over
// 500 MB, or storage unavailable).

import { captureFramesAt, type ExtractedFrame } from '@/lib/mediacrater/dissector';
import type { Violation } from '@/lib/mediacrater/scoreCalculator';

// Frames are taken roughly every 0.5 s, so the nearest frame is never more
// than ~1 s from any moment in the video. Farther than that, show nothing.
const MAX_MATCH_DISTANCE_SECONDS = 1;
const MAX_FRAMES_PER_VIOLATION = 8;

export type EvidenceFrames = Record<string, string>;

// "MM:SS.cc" (see formatTimestamp in dissector.ts) -> seconds.
// Returns null for anything else the model might return.
export function parseTimestampSeconds(value: string): number | null {
  const match = /^(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?$/.exec(value.trim());
  if (!match) return null;
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  if (seconds > 59) return null;
  const fraction = match[3] ? Number(`0.${match[3]}`) : 0;
  return minutes * 60 + seconds + fraction;
}

// Every distinct timestamp the model cited for a violation (no cap). The
// model returns them as one comma-joined string ("00:02.43, 00:10.67, ..."),
// which scoreCalculator wraps in an array, so split each entry on commas.
// Model output is untrusted, so non-strings are dropped.
export function violationTimestamps(violation: Violation): string[] {
  const all = (violation.timestamps ?? [])
    .filter((value): value is string => typeof value === 'string')
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return Array.from(new Set(all));
}

// The first few, for thumbnails.
export function evidenceTimestamps(violation: Violation): string[] {
  return violationTimestamps(violation).slice(0, MAX_FRAMES_PER_VIOLATION);
}

// Evidence frames use the same lightbox as before; 900px at 0.6 keeps each
// frame small enough for evidenceStore.ts's sessionStorage budget.
const EVIDENCE_LONG_EDGE = 900;
const EVIDENCE_QUALITY = 0.6;

/**
 * timestamp string -> frame data URL, captured from the local video file at
 * each distinct timestamp the violations cite (first few per violation).
 * Never throws: evidence frames are a nice-to-have, not worth failing a scan.
 */
export async function collectEvidenceFrames(
  videoFile: File,
  violations: Violation[],
  signal?: AbortSignal | null
): Promise<EvidenceFrames> {
  const evidence: EvidenceFrames = {};
  const wanted = new Map<string, number>();

  for (const violation of violations) {
    for (const timestamp of evidenceTimestamps(violation)) {
      if (wanted.has(timestamp)) continue;
      const seconds = parseTimestampSeconds(timestamp);
      if (seconds !== null) wanted.set(timestamp, seconds);
    }
  }

  if (wanted.size === 0) return evidence;

  try {
    const labels = Array.from(wanted.keys());
    const frames = await captureFramesAt(
      videoFile,
      labels.map((label) => wanted.get(label) as number),
      signal,
      { maxLongEdge: EVIDENCE_LONG_EDGE, quality: EVIDENCE_QUALITY }
    );

    // captureFramesAt keeps input order but skips failed seeks, so match by
    // the requested time rather than by position.
    for (const label of labels) {
      const seconds = wanted.get(label) as number;
      const frame = frames.find((item) => item.timestampSeconds === seconds);
      if (frame) evidence[label] = frame.data;
    }
  } catch (error) {
    console.warn('[EVIDENCE] Could not capture frames:', error);
  }

  return evidence;
}

// timestamp string -> frame data URL, only for timestamps with a close frame.
export function pickEvidenceFrames(
  frames: ExtractedFrame[],
  violations: Violation[]
): EvidenceFrames {
  const evidence: EvidenceFrames = {};
  if (frames.length === 0) return evidence;

  for (const violation of violations) {
    for (const timestamp of evidenceTimestamps(violation)) {
      if (evidence[timestamp]) continue;

      const target = parseTimestampSeconds(timestamp);
      if (target === null) continue;

      let best: ExtractedFrame | null = null;
      let bestDistance = Infinity;
      for (const frame of frames) {
        const distance = Math.abs(frame.timestampSeconds - target);
        if (distance < bestDistance) {
          best = frame;
          bestDistance = distance;
        }
      }

      if (best && bestDistance <= MAX_MATCH_DISTANCE_SECONDS) {
        evidence[timestamp] = best.data;
      }
    }
  }

  return evidence;
}
