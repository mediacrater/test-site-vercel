//lib/onboarding/config.ts
//
// The on/off switch for onboarding. Set NEXT_PUBLIC_ONBOARDING=on in Vercel
// (then redeploy) to turn it on. Anything else, or no variable at all, is off.
//
// Off means: no redirect from the dashboard, no "Onboarding questions" item in
// the sidebar, no tutorial popup, and /onboarding sends people back to the
// dashboard. The code can therefore be deployed first and switched on later,
// and switched off again without a new upload.
//
// NEXT_PUBLIC_ variables are read when the site is built, so a change only
// takes effect after a redeploy.

const raw = (process.env.NEXT_PUBLIC_ONBOARDING ?? '').trim().toLowerCase();

export const ONBOARDING_ENABLED = raw === 'on' || raw === 'true' || raw === '1';

// The tutorial shown in the popup: the same YouTube video the sidebar's
// "Video tutorial" link opens.
export const TUTORIAL_YOUTUBE_ID = 't8k6-XgiBig';

// The interactive tour points at the sidebar and the top bar, which only exist
// from Tailwind's lg breakpoint up (see components/app-shell.tsx).
export const TOUR_MIN_WIDTH_PX = 1024;

// ---------------------------------------------------------------------------
// Safety valve
// ---------------------------------------------------------------------------
// If /onboarding cannot start (for example the database functions are not
// installed yet), the page records that here and the dashboard stops sending
// this browser tab back to it. Without this, "dashboard -> onboarding -> error
// -> dashboard" would loop. It lasts until the tab is closed.

const UNAVAILABLE_KEY = 'mc_onboarding_unavailable';

export function markOnboardingUnavailable() {
  try {
    window.sessionStorage.setItem(UNAVAILABLE_KEY, '1');
  } catch {
    // storage unavailable: nothing else to do
  }
}

export function isOnboardingUnavailable(): boolean {
  try {
    return window.sessionStorage.getItem(UNAVAILABLE_KEY) === '1';
  } catch {
    return false;
  }
}
