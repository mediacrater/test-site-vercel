//components/social-proof.tsx
// Shows real direct messages from July 2025, before the product existed.
// Keep the caption honest: these are reactions to the idea, not product reviews.
const shots = [
  {
    src: "/images/testimonials/fb-comment-1.png",
    alt: "Message thread with Maham Khan, who replied to the idea with a thumbs up.",
  },
  {
    src: "/images/testimonials/fb-comment-2.png",
    alt: "Message from Roy Mark Olino Conde saying the idea is great and he had not seen software with this function.",
  },
  {
    src: "/images/testimonials/fb-comment-3.png",
    alt: "Message from S Tania Akther saying a tool that checks creatives before upload would save marketers time and stress.",
  },
]

export function SocialProof() {
  return (
    <section aria-labelledby="proof-title" className="overflow-hidden border-t border-border py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-5">
          <h2 id="proof-title" className="display-lg text-[clamp(2.1rem,4.4vw,3.4rem)]">
            The people buying the traffic know the problem.
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
            Policy issues are not theoretical when your campaigns are live. These conversations with media buyers are
            what led us to build a better way to review creatives before submission.
          </p>
          <p className="mt-6 text-[0.95rem] text-muted-foreground">
            Direct messages from July 2025, when Mediacrater was still an idea.
          </p>
        </div>

        <div className="lg:col-span-7">
          <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 [scrollbar-width:none]">
            {shots.map((s, i) => (
              <li
                key={s.src}
                className={`w-[64vw] shrink-0 snap-center sm:w-auto ${i === 1 ? "sm:translate-y-8" : i === 2 ? "sm:translate-y-16" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.alt}
                  width={828}
                  height={1792}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-[22px] border border-border bg-black shadow-[0_30px_60px_-36px_rgba(11,22,40,0.55)]"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
