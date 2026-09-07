import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  ["What is ad creative compliance?","Ad creative compliance is the process of reviewing an advertisement for potential violations of an advertising platform's policies before the ad is submitted or launched."],
  ["What does Mediacrater analyze?","Mediacrater analyzes your creative for potential policy risks, including relevant visual content, language, claims, and other signals depending on the scan type and platform selected."],
  ["Which advertising platforms are supported?","Mediacrater supports analysis for major advertising platforms including Meta, TikTok, Google and others. Available platform coverage can evolve as policies and the product develop."],
  ["Can Mediacrater guarantee that my ad will be approved?","No. Mediacrater identifies potential policy risks; it does not control a platform's final review or approval decision."],
  ["Does Mediacrater analyze video ads?","Yes. Video analysis can identify potential issues at specific points in the creative, making it easier to review the exact language or visual that triggered a finding."],
]

export function FAQ() { return <section id="faq" className="border-b border-border py-24 md:py-32"><div className="mx-auto max-w-4xl px-4 sm:px-6"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Frequently asked questions</p><h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold tracking-[-.035em] sm:text-5xl">Questions before you launch?</h2><p className="mt-4 text-muted-foreground">Here are the answers media buyers usually want first.</p></div><Accordion type="single" collapsible className="mt-12 w-full">{faqs.map(([q,a],i)=><AccordionItem key={q} value={`item-${i}`} className="border-border"><AccordionTrigger className="py-6 text-left text-base font-semibold hover:no-underline">{q}</AccordionTrigger><AccordionContent className="max-w-3xl pb-6 text-sm leading-relaxed text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section> }
