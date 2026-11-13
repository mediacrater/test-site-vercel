//app/onboarding/page.tsx
//
// The onboarding questions, one per screen, then the recommended plan.
// Full screen on purpose (no sidebar or top bar): one thing to do at a time.
// Everything lives in components/onboarding/onboarding-flow.tsx; this file
// only provides the Suspense boundary that useSearchParams() needs.

import { Suspense } from 'react';
import { OnboardingFlow, OnboardingLoading } from '@/components/onboarding/onboarding-flow';

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingLoading />}>
      <OnboardingFlow />
    </Suspense>
  );
}
