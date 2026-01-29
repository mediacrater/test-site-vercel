"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Does Mediacrater guarantee my ad will be approved?",
    answer:
      "No. Mediacrater provides a confidence score based on publicly accessible ad policies. Your video is still subject to each platform's proprietary detection algorithms. We help you identify and fix potential issues before uploading, significantly reducing rejection risk, but final approval is always at the platform's discretion.",
  },
  {
    question: "How does the token system work?",
    answer:
      "Each scan consumes tokens based on video length, scan depth, platforms, and audio analysis. A basic scan of a short video (<50s) on one platform costs just 1 token. Longer videos, deeper scans, or multi-platform checks add more tokens. You can see the exact token cost before each scan.",
  },
  {
    question: "Is my video data secure?",
    answer:
      "Absolutely. Mediacrater uses a privacy-first architecture. Your original video files are temporarily passed to us, analysed and then immediately deleted from our memory and storage.",
  },
  {
    question: "Which platforms do you support?",
    answer:
      "We currently support Meta (Facebook & Instagram), TikTok, YouTube/Google Ads, Pinterest, and X (formerly Twitter). Our policy engine is continuously updated as platforms change their advertising guidelines.",
  },
  {
    question: "What's the difference between scan depths?",
    answer:
      "Basic Scan (1fp3s) captures 1 frame every 3 seconds—ideal for simple product ads. Strategic Scan (1fps) captures 1 frame per second for detailed campaigns. Deep Scan (3fps) provides frame-by-frame analysis, perfect for high-risk verticals like Healthcare, Finance, or political advertising.",
  },
  {
    question: "Do unused tokens expire?",
    answer:
      "For one-time purchases, tokens never expire. For monthly subscriptions, unused tokens roll over for 3 months. Annual subscribers enjoy tokens that never expire, plus significant discounts of up to 55% off.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Tokens are non-refundable once used for scans. Unused tokens from one-time purchases can be refunded within 14 days. For subscriptions, you can cancel anytime, and unused tokens remain valid according to the rollover policy.",
  },
  {
    question: "Is Mediacrater affiliated with Meta, TikTok, or Google?",
    answer:
      "No. Mediacrater is an independent tool and is not affiliated with, endorsed by, or sponsored by any of the platforms we analyze. Platform logos are displayed solely for user experience to indicate which policies are being checked.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)] text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about Mediacrater.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
