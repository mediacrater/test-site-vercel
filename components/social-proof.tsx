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
    <section className="py-16 bg-secondary/10 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 font-mono text-xs text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
          Buyer Validation
        </div>

        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground font-[family-name:var(--font-display)]">
            Feedback from media buyers.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {validationComments.map((comment) => (
            <div
              key={comment.id}
              className="border border-border bg-card p-4 rounded-none flex flex-col justify-between"
            >
              <div className="mb-4 border border-border bg-background p-2">
                <Image
                  src={comment.screenshot || "/placeholder.svg"}
                  alt={`Feedback from ${comment.author}`}
                  width={400}
                  height={600}
                  className="object-contain w-full h-auto rounded-none"
                />
              </div>
              <div className="border-t border-border pt-3 font-mono">
                <p className="text-xs font-bold text-foreground uppercase">{comment.author}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{comment.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-border bg-card p-3 font-mono text-center text-xs text-muted-foreground uppercase">
          [ Statements collected from active ad communities ]
        </div>
      </div>
    </section>
  )
}
