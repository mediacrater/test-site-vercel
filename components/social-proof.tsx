"use client"

import Image from "next/image"
import { MessageCircle, Quote } from "lucide-react"

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
    <section className="border-b border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[0.55fr_1.45fr]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Market validation</p>
            <h2 className="mt-4 max-w-md font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Built around a problem media buyers already recognize.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Before building the product, we asked working media buyers whether pre-publish creative analysis would solve a real problem. These are the original responses.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
          {validationComments.map((comment, index) => (
            <article key={comment.id} className="bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                  Original response
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span>
              </div>

              <div className="bg-muted/10 p-4">
                <Image
                  src={comment.screenshot || "/placeholder.svg"}
                  alt={`Media buyer validation feedback from ${comment.author} - ${comment.quote}`}
                  width={400}
                  height={600}
                  className="h-auto w-full object-contain"
                />
              </div>

              <div className="border-t border-border p-5">
                <Quote className="h-4 w-4 text-primary" />
                <p className="mt-3 text-sm font-medium leading-6 text-foreground">{comment.quote}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-bold text-foreground">{comment.author}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{comment.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 bg-primary" />
          Real feedback from Facebook advertising communities
        </div>
      </div>
    </section>
  )
}
