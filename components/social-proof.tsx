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
    <section className="py-16 md:py-24 bg-background border-b border-border font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
            [SYS_LOG: COMMUNITY_VALIDATION]
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight">
            Built to Solve Real Problems
          </h2>
          <p className="mt-3 text-xs text-muted-foreground border-l-2 border-border pl-3">
            &gt; Before deployment, core functionality was validated with professional media buyers. Log readouts attached below.
          </p>
        </div>

        {/* Validation Screenshots Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {validationComments.map((comment) => (
            <div
              key={comment.id}
              className="flex flex-col border border-border bg-card"
            >
              <div className="bg-muted/50 border-b border-border px-3 py-1.5 flex justify-between items-center text-[9px] uppercase font-bold text-muted-foreground">
                <span>packet_id: {comment.id}</span>
                <span className="text-emerald-500">200_OK</span>
              </div>
              
              <div className="p-3 bg-black/5">
                <Image
                  src={comment.screenshot || "/placeholder.svg"}
                  alt={`Feedback from ${comment.author}`}
                  width={400}
                  height={600}
                  className="w-full h-auto border border-border grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              
              <div className="p-3 border-t border-dashed border-border bg-background">
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-foreground uppercase">ID: {comment.author}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">ROLE: {comment.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-left">
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-border bg-card">
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              DATA_SOURCE: Facebook advertising communities
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
