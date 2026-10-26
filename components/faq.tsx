//components/faq.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { JsonLd } from "@/components/tools/json-ld"
import { CONTACT_EMAIL } from "@/lib/legal/policies"

const faqs: [string, string][] = [
  ["What is ad creative compliance?", "Ad creative compliance is the process of reviewing an advertisement for potential violations of an advertising platform's policies before the ad is submitted or launched."],
  ["Why can't I run more scans on a second free account?", "Multiple accounts are allowed as long as they are all on paid plans. Our automated systems group and limit accounts that are on the free plan with a high possibility of relation. You can get more scans or tokens by upgrading to a paid plan. If you think your accounts were grouped by mistake, for example because you share a device or network with someone else, contact us and we'll review it."],
  ["What does Mediacrater analyze?", "Mediacrater analyzes your creative for potential policy risks, including relevant visual content, language, claims, and other signals depending on the scan type and platform selected."],
  ["Which advertising platforms are supported?", "Mediacrater supports analysis for major advertising platforms including Meta, TikTok, YouTube, Pinterest and X. Available platform coverage can evolve as policies and the product develop."],
  ["Can Mediacrater guarantee that my ad will be approved?", "No. Mediacrater identifies potential policy risks. It does not control a platform's final review or approval decision."],
  ["Does Mediacrater analyze video ads?", "Yes. Video analysis can identify potential issues at specific points in the creative, making it easier to review the exact language or visual that triggered a finding."],
  ["Is my video data secure?", "Your original file is sent to us only to run the scan and is deleted from our storage when the scan finishes. We keep the text results with your account, and on paid plans a low resolution thumbnail for Scan History. How our AI provider handles the content it analyzes is explained in our Privacy Policy."],
  ["Why do you retain thumbnails?", "We retain deliberately low resolution thumbnails of your image and video creatives as a visual reference for the Scan History feature. These thumbnails are collected and stored for scans made by clients on any paid plan."],
  ["Do unused tokens expire?", "Tokens expire and renew at the end of your billing cycle. They do not carry over to the next month."],
  ["Is Mediacrater affiliated with Meta, TikTok, or Google?", "No. Mediacrater is an independent tool and is not affiliated with, endorsed by, or sponsored by any of the platforms we analyze, including Meta. Platform logos are displayed solely for user experience to indicate which policies are being checked."],
]

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-border py-24 md:py-32">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <h2 id="faq-title" className="display-lg text-[clamp(2.1rem,4.4vw,3.4rem)]">
              Questions before you launch?
            </h2>
            <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-muted-foreground">
              The answers media buyers usually want first. Anything else, email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-link underline underline-offset-4 [overflow-wrap:anywhere]">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full lg:col-span-7 lg:col-start-6">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={q} value={`item-${i}`} className="border-border first:border-t">
              <AccordionTrigger className="py-6 text-left text-[1.125rem] font-bold leading-snug hover:no-underline [&>svg]:size-5 [&>svg]:text-foreground">
                {q}
              </AccordionTrigger>
              <AccordionContent className="max-w-[62ch] pb-7 text-[1.0625rem] leading-relaxed text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
