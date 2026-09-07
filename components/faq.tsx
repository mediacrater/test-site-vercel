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
    answer: "No. Mediacrater provides a confidence score based on publicly accessible ad policies. Your video is still subject to each platform's proprietary detection algorithms. We help you identify and fix potential issues before uploading, significantly reducing rejection risk, but final approval is always at the platform's discretion.",
  },
  {
    question: "How does the scan system work?",
    answer: "One scan deducts one from your scan amount regardless of scan type or video length. You can see the exact cost before each scan, always one.",
  },
  {
    question: "Is my video data secure?",
    answer: "Absolutely. Mediacrater uses a privacy-first architecture. Your original video files are temporarily passed to us, analysed and then immediately deleted from our memory and storage.",
  },
  {
    question: "Which platforms do you support?",
    answer: "We currently support Meta (Facebook & Instagram), TikTok, YouTube/Google Ads, Pinterest, and X (formerly Twitter). Our policy engine is continuously updated as platforms change their advertising guidelines.",
  },
  {
    question: "What's the difference between scan depths?",
    answer: "Basic Scan is ideal for simple product ads with no fast cuts. The Deep Scan is ideal for videos with cuts that last 1 second or less.",
  },
  {
    question: "Do unused tokens expire?",
    answer: "Tokens expire and renew at the end of your billing cycle, they do not carry over to the next month.",
  },
  {
    question: "Can I get a refund?",
    answer: "Tokens cannot be reaccumulated once used for scans. Unused tokens can be refunded within 7 days of purchase. We may deduct the unrecoverable processing fees from refunds.",
  },
  {
    question: "Is Mediacrater affiliated with Meta, TikTok, or Google?",
    answer: "No. Mediacrater is an independent tool and is not affiliated with, endorsed by, or sponsored by any of the platforms we analyze including Meta. Platform logos are displayed solely for user experience to indicate which policies are being checked.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 font-mono">
            <div className="mb-4 text-xs text-muted-foreground uppercase tracking-widest border-l-2 border-primary pl-3">
              Documentation
            </div>
            <h2 className="text-3xl font-bold uppercase tracking-tight text-foreground font-[family-name:var(--font-display)]">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-xs text-muted-foreground leading-normal">
              System usage, scan depth definitions, privacy policy limits, and account handling.
            </p>
          </div>

          <div className="lg:col-span-8 font-mono">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="border border-border bg-card px-4 rounded-none"
                >
                  <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline py-3 text-xs uppercase">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-3 text-xs border-t border-border/50 pt-2 font-sans">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
