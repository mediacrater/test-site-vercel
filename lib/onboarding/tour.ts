//lib/onboarding/tour.ts
//
// The interactive tour: small bubbles that point at parts of the dashboard and
// say what they are for. Built on driver.js (MIT, no dependencies of its own,
// pinned to an exact version in package.json).
//
// This file is loaded only when someone starts the tour (a dynamic import in
// components/onboarding/tutorial-dialog.tsx), so it adds nothing to the normal
// page load.
//
// Each step points at an element by its data-tour attribute:
//   scan-box       app/dashboard/page.tsx      the "Run Ad Compliance Scan" block
//   nav-history    components/app-sidebar.tsx  the Scan History link
//   nav-settings   components/app-sidebar.tsx  the Settings link
//   account-menu   components/app-topbar.tsx   the email in the top right
// data-tour attributes exist only for this tour, so restyling those elements
// cannot break it. A step whose element is not on screen is left out.
//
// The tour can be left at any point: the X, the Esc key, or "Skip tour".
//
// Security note: driver.js writes each step's title and description into the
// page as HTML. The texts below are fixed strings, which is safe. Never build
// a step from anything a user typed (an email address, a file name).

import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tour.css';

import { TOUR_MIN_WIDTH_PX } from './config';

export type TourOutcome = 'completed' | 'skipped';

interface TourStep {
  target: string;
  title: string;
  description: string;
  side: 'top' | 'right' | 'bottom' | 'left';
  align: 'start' | 'center' | 'end';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: 'scan-box',
    title: 'Scan your creatives here',
    description: 'Drop a video or image ad here, or paste a link to one.',
    side: 'top',
    align: 'center',
  },
  {
    target: 'nav-history',
    title: 'Scan History',
    description: 'Keeps a history of all your scans. Needs a paid plan.',
    side: 'right',
    align: 'start',
  },
  {
    target: 'nav-settings',
    title: 'Settings',
    description: 'Manage your plan, contact support and view the shortcut keys.',
    side: 'right',
    align: 'start',
  },
  {
    target: 'account-menu',
    title: 'Your account',
    description: 'The email you signed up with. Click it to get the Chrome extension or sign out.',
    side: 'bottom',
    align: 'end',
  },
];

/** True when the screen is wide enough for the sidebar and top bar to exist. */
export function canRunTour(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(`(min-width: ${TOUR_MIN_WIDTH_PX}px)`).matches;
}

function findVisible(target: string): HTMLElement | null {
  const element = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
  if (!element) return null;
  const box = element.getBoundingClientRect();
  return box.width > 0 && box.height > 0 ? element : null;
}

/**
 * Starts the tour. Returns false (and does nothing) when it cannot run: the
 * screen is too narrow, or none of its targets are on the page.
 * onEnd is called exactly once, when the tour closes:
 *   'completed'  the person reached the last step and pressed Done
 *   'skipped'    anything else (X, Esc, "Skip tour", leaving the page)
 */
export function startTour(onEnd: (outcome: TourOutcome) => void): boolean {
  if (!canRunTour()) return false;

  const steps: DriveStep[] = [];
  for (const step of TOUR_STEPS) {
    const element = findVisible(step.target);
    if (!element) continue;
    steps.push({
      element,
      popover: {
        title: step.title,
        description: step.description,
        side: step.side,
        align: step.align,
      },
    });
  }
  if (steps.length === 0) return false;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ended = false;

  const tour = driver({
    steps,
    popoverClass: 'mc-tour',
    animate: !reduceMotion,
    smoothScroll: !reduceMotion,
    showProgress: true,
    progressText: '{{current}} of {{total}}',
    nextBtnText: 'Next',
    prevBtnText: 'Back',
    doneBtnText: 'Done',
    closeBtnLabel: 'Close the tour',
    allowClose: true,
    // A stray click on the dimmed page should not end the tour. The X, Esc and
    // "Skip tour" do.
    overlayClickBehavior: 'none',
    // The highlighted links stay un-clickable during the tour, so nobody is
    // taken to another page half-way through.
    disableActiveInteraction: true,
    skipMissingElement: true,
    stagePadding: 8,
    stageRadius: 10,

    onPopoverRender: (popover, { driver: active }) => {
      if (active.isLastStep()) return;
      const skip = document.createElement('button');
      skip.type = 'button';
      skip.className = 'mc-tour-skip';
      skip.textContent = 'Skip tour';
      skip.addEventListener('click', () => active.destroy());
      popover.footer.insertBefore(skip, popover.footerButtons);
    },

    onDestroyed: (_element, _step, { reason }) => {
      if (ended) return;
      ended = true;
      onEnd(reason === 'done' ? 'completed' : 'skipped');
    },
  });

  tour.drive();
  return true;
}
