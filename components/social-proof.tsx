"use client"

import Image from "next/image"
import { MessageCircle } from "lucide-react"

// Real validation screenshots from media buyers
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
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Validated by Media Buyers
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)] text-balance">
            Built to Solve Real Problems
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Before building Mediacrater, we validated the idea with professional media buyers. Here are their real responses.
          </p>
        </div>

        {/* Validation Screenshots Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {validationComments.map((comment) => (
            <div
              key={comment.id}
              className="group flex flex-col"
            >
              {/* Screenshot Container with Glow Effect */}
              <div className="relative mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-card border border-border rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
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
              </div>
              
              {/* Author Info */}
              <div className="px-2 flex items-center gap-3">
                <div className="h-10 w-[3px] bg-gradient-to-b from-primary to-accent rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">{comment.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-sm text-muted-foreground">
              Real feedback from Facebook advertising communities
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
