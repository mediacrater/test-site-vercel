//components/onboarding/tutorial-dialog.tsx
'use client';

// The "Watch the tutorial" popup on the dashboard, shown once after
// onboarding ends (finished or skipped). Three ways to answer it:
//   - play the video (the popup stays open while it plays)
//   - "Start interactive tutorial": closes the popup and starts the tour
//   - "I'm just exploring for now" (closing the popup counts as this)
// Each is saved with onboarding_tutorial_event(), so it does not come back.
//
// It also starts the tour when the page is opened as /dashboard?tour=1, which
// is what the "Take the interactive tour" command in the command palette does.
//
// The video:
//   - is loaded from youtube-nocookie.com, and only after the person presses
//     play. Until then nothing is requested from YouTube, which matters while
//     the site has no cookie consent prompt. The play button sits on a plain
//     panel instead of YouTube's thumbnail for the same reason.
//   - needs https://www.youtube-nocookie.com in frame-src (next.config.mjs).
//
// The tour button is hidden on screens narrower than the lg breakpoint: the
// sidebar and top bar it points at do not exist there.
//
// The popup waits while the account's trial is over: those accounts already
// get the "Your free trial has ended" dialog (components/trial-ended-dialog.tsx)
// and two popups at once help nobody. It appears once they have a plan.
//
// Mounted by app/dashboard/page.tsx once the dashboard has loaded, so the
// tour's targets are on the page.

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTrialState } from '@/lib/mediacrater/useTrialState';
import { recordTutorialEvent, type TutorialEvent } from '@/lib/onboarding/api';
import { ONBOARDING_ENABLED, TOUR_MIN_WIDTH_PX, TUTORIAL_YOUTUBE_ID } from '@/lib/onboarding/config';
import {
  publishOnboardingRow,
  shouldShowTutorialPrompt,
  useOnboardingRow,
} from '@/lib/onboarding/useOnboardingRow';

const VIDEO_TITLE = 'Mediacrater tutorial';

const VIDEO_SRC = `https://www.youtube-nocookie.com/embed/${TUTORIAL_YOUTUBE_ID}?${new URLSearchParams({
  autoplay: '1', // the person pressed play, so start with sound
  rel: '0',
  modestbranding: '1',
  playsinline: '1',
}).toString()}`;

// Saving a tutorial event must never get in the person's way: a failure is
// logged and the popup or tour carries on.
function record(event: TutorialEvent) {
  recordTutorialEvent(event)
    .then(publishOnboardingRow)
    .catch((error) => console.error(`Tutorial event "${event}" was not saved:`, error));
}

function useWideScreen(): boolean {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${TOUR_MIN_WIDTH_PX}px)`);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return wide;
}

async function runTour() {
  const { startTour } = await import('@/lib/onboarding/tour');
  const started = startTour((outcome) => record(outcome === 'completed' ? 'tour_completed' : 'tour_skipped'));
  if (started) record('tour_started');
  return started;
}

export function TutorialDialog() {
  const state = useOnboardingRow();
  const searchParams = useSearchParams();
  const wideScreen = useWideScreen();
  const trial = useTrialState();
  // Known and not over. 'loading' waits, so the popup never opens first and
  // then finds out the trial-ended dialog is about to open on top of it.
  const trialAllowsPopup = trial.phase !== 'loading' && trial.phase !== 'ended';

  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Someone who arrived to scan a link from the extension gets the popup on
  // their next visit instead. Read once: the scanner removes the parameter.
  const arrivedToScan = useRef(Boolean(searchParams.get('scan_url'))).current;
  const answered = useRef(false);
  const tourFromLink = useRef(false);

  // Open once the row says onboarding is over and the popup was never answered.
  useEffect(() => {
    if (!ONBOARDING_ENABLED || answered.current || arrivedToScan || tourFromLink.current) return;
    if (!trialAllowsPopup) return;
    if (shouldShowTutorialPrompt(state)) setOpen(true);
  }, [state, arrivedToScan, trialAllowsPopup]);

  // /dashboard?tour=1 : start the tour directly (command palette).
  useEffect(() => {
    if (!ONBOARDING_ENABLED || searchParams.get('tour') !== '1' || tourFromLink.current) return;
    tourFromLink.current = true;
    answered.current = true;
    setOpen(false);
    window.history.replaceState({}, '', window.location.pathname);

    // One beat, so the dashboard has painted and the targets can be measured.
    // No cleanup on purpose: removing ?tour=1 above makes this effect run
    // again, and a cleanup would cancel the timer it just set. If the person
    // has left the dashboard by then, startTour() finds nothing and returns.
    window.setTimeout(() => {
      runTour().catch((error) => console.error('The tour could not start:', error));
    }, 300);
  }, [searchParams]);

  function handlePlay() {
    setPlaying(true);
    record('video_played');
  }

  function handleExploring() {
    if (answered.current) return;
    answered.current = true;
    setOpen(false);
    record('exploring');
  }

  function handleStartTour() {
    if (answered.current) return;
    answered.current = true;
    setOpen(false);

    // Wait for the popup to finish closing: while it is open the rest of the
    // page is inert, and the tour needs to measure and focus it.
    window.setTimeout(() => {
      runTour()
        .then((started) => {
          // Nothing to point at (should not happen on the dashboard): record
          // the popup as answered so it does not reopen.
          if (!started) record('exploring');
        })
        .catch((error) => {
          console.error('The tour could not start:', error);
          record('exploring');
        });
    }, 300);
  }

  if (!ONBOARDING_ENABLED) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : handleExploring())}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Watch the tutorial</DialogTitle>
          <DialogDescription>See how Mediacrater works before your first scan.</DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-[var(--ink)]">
          {playing ? (
            <iframe
              src={VIDEO_SRC}
              title={VIDEO_TITLE}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play the Mediacrater tutorial"
              className="group absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-transform group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                <Play aria-hidden="true" className="h-5 w-5 fill-current" />
                Play the tutorial
              </span>
              <span className="text-sm text-[var(--ink-muted)]">Plays here, from YouTube</span>
            </button>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleExploring}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-secondary motion-reduce:transition-none"
          >
            I&apos;m just exploring for now
          </button>
          {wideScreen && (
            <button
              type="button"
              onClick={handleStartTour}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 motion-reduce:transition-none"
            >
              Start interactive tutorial
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
