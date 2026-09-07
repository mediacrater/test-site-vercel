"use client"

import Image from "next/image"

const validationComments = [
  {
    id: 1,
    screenshot: "/images/testimonials/fb-comment-1.png",
    quote: "Thumbs up - this sounds useful!",
    author: "Maham Khan",
    role: "Facebook Ads Expert",
  },
  {
    id: 2,
    screenshot: "/images/testimonials/fb-comment-2.png",
    quote: "The idea is great and I didn't see any software yet with this function... most of the time we only rely on meta ads manager whether they reject it or not.",
    author: "Roy Mark Olino Conde",
    role: "Media Buyer",
  },
  {
    id: 3,
    screenshot: "/images/testimonials/fb-comment-3.png",
    quote: "Your idea is great — ad rejection and account bans are a big problem. A tool that checks creatives before uploading would save time and stress for marketers.",
    author: "S Tania Akther",
    role: "Ad Specialist",
  },
]

export function SocialProof() {
  return (
    <section className="py-16 md:py-24 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-end gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Before the product
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)]">
              The problem was easy for media buyers to recognize.
            </h2>
          </div>

          <p className="text-lg leading-relaxed text-muted-foreground">
            We asked working media buyers what they thought of a pre-upload ad
            checker. These are the original responses — shown as screenshots,
            rather than polished into generic testimonials.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8">
          {validationComments.map((comment) => (
            <div key={comment.id} className="flex flex-col">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-3 bg-muted/30">
                  <Image
                    src={comment.screenshot || "/placeholder.svg"}
                    alt={`Media buyer validation feedback from ${comment.author} - ${comment.quote}`}
                    width={400}
                    height={600}
                    className="rounded-lg object-contain w-full h-auto border border-border/50"
                  />
                </div>
              </div>

              <div className="mt-4 px-1">
                <p className="text-sm font-semibold text-foreground">
                  {comment.author}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {comment.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
