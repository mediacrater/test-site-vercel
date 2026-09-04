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
    <section id="faq" className="py-16 md:py-24 font-mono bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Left Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-20">
            <div className="border border-border p-6 bg-card relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">[DIR: /knowledge_base/faq]</p>
              <h2 className="text-2xl font-bold text-foreground uppercase tracking-tight">
                Frequently Asked<br/>Questions
              </h2>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                Everything you need to know about Mediacrater scans, privacy, and account compatibility.
              </p>
            </div>
          </div>

          {/* Right Accordions */}
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible className="w-full border-t border-border">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border bg-card px-2 hover:bg-secondary/20 transition-colors">
                  <AccordionTrigger className="text-left font-bold text-foreground py-4 text-xs sm:text-sm uppercase tracking-wide hover:no-underline flex gap-4">
                    <span className="text-primary shrink-0">&gt;</span>
                    <span className="flex-1">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2 pl-6 text-xs border-l border-dashed border-border ml-2 mb-4">
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
