'use client';

// components/auth-showcase-panel.tsx
//
// The non-form side of the split-screen sign-in/sign-up layout. Fixed dark
// ink background regardless of site theme, while the form side follows it.
//
// The quotes are real replies to Edward's direct messages from July 2025,
// when the product was still an idea. Quote only what each person wrote,
// and keep the "feedback on the idea" label so they don't read as reviews.

const TESTIMONIALS = [
  {
    name: 'Roy Mark Olino Conde',
    role: 'Media Buyer',
    quote: "The idea is great and I didn't see any software yet with this function.",
  },
  {
    name: 'S Tania Akther',
    role: 'Ad Specialist',
    quote: 'A tool that checks creatives before uploading would save time and stress for marketers.',
  },
];

export function AuthShowcasePanel({ variant }: { variant: 'signin' | 'signup' }) {
  const heading =
    variant === 'signup' ? 'Stop guessing whether your ad will get banned.' : 'Welcome back.';

  const subheading =
    variant === 'signup'
      ? 'Scan your creative against Meta, TikTok, YouTube, Pinterest, and X policies before you spend a dollar on media.'
      : 'Your scans, history, and plan are exactly where you left them.';

  const quotes = variant === 'signup' ? TESTIMONIALS : TESTIMONIALS.slice(0, 1);

  return (
    <div className="hidden min-h-screen w-1/2 flex-col justify-between bg-[#0b1628] px-12 py-14 text-[#e7edf5] lg:flex">
      <div>
        <a href="/" className="inline-flex items-center gap-2.5">
          <img src="/images/logo-mark-dark-96.png" alt="" width={36} height={36} className="h-9 w-9" />
          <span className="font-display text-lg font-extrabold">Mediacrater</span>
        </a>

        <h1 className="display-lg mt-20 max-w-[16ch] text-[2.6rem]">{heading}</h1>
        <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-relaxed text-[#93a3ba]">{subheading}</p>
      </div>

      <div>
        <p className="mb-4 text-sm text-[#93a3ba]">Feedback from media buyers on the idea, July 2025</p>
        <ul className="space-y-4">
          {quotes.map((t) => (
            <li key={t.name} className="max-w-md border-l-2 border-[#b8f23f] pl-5">
              <p className="text-[1.0625rem] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-2 text-sm text-[#93a3ba]">
                {t.name}, {t.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
