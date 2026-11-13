//app/onboarding/layout.tsx
// Server component, only here to give the (client-side) onboarding page its
// title and to keep it out of search engines, like the other signed-in pages.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome | Mediacrater',
  robots: { index: false, follow: false },
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
