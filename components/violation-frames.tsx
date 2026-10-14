// components/violation-frames.tsx

import {
  evidenceTimestamps,
  type EvidenceFrames,
} from '@/lib/mediacrater/evidenceFrames';
import type { Violation } from '@/lib/mediacrater/scoreCalculator';

export function ViolationFrames({
  violation,
  evidence,
}: {
  violation: Violation;
  evidence: EvidenceFrames | undefined;
}) {
  if (!evidence) return null;

  const shots = evidenceTimestamps(violation).filter((ts) => evidence[ts]);
  if (shots.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
      {shots.map((ts) => (
        <figure key={ts} className="shrink-0 m-0">
          <img
            src={evidence[ts]}
            alt={`Video frame at ${ts}`}
            className="h-24 w-auto rounded-md border border-border object-cover"
          />
          <figcaption className="mt-1 text-center text-[10px] text-muted-foreground">
            {ts}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
