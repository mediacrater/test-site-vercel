// components/free-plan-ending-banner.tsx
'use client';

const FREE_PLAN_END = new Date('2026-11-25T23:59:59-05:00'); // Toronto time

export function FreePlanEndingBanner({ plan }: { plan: string | null }) {
  // Only free-plan users are affected. Adjust if your plan value differs.
  if (plan !== 'free') return null;
  if (new Date() > FREE_PLAN_END) return null;

  return (
    <div
      role="status"
      className="bg-amber-100 dark:bg-transparent text-amber-800 dark:text-[#fbbf24] text-center py-2 px-5 text-sm font-semibold border-b border-[#fde68a] dark:border-[#4d2900] tracking-[0.2px]"
    >
      The free plan ends on November 25, 2026 and is being replaced by a 14-day free trial.{' '}
      <a href="/blog/free-plan-changes" className="underline underline-offset-2">
        What this means for you
      </a>
    </div>
  );
}
