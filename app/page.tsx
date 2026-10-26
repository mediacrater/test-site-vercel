//app/page.tsx
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { AdAccountInsurance } from "@/components/ad-account-insurance"
import { SocialProof } from "@/components/social-proof"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { OwnYourAccounts } from "@/components/own-your-accounts"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { VerificationDialog } from "@/components/verification-dialog"
import { JsonLd } from "@/components/tools/json-ld"
import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

const SITE = "https://mediacrater.com"

// Structured data: who we are and what the product costs. Prices must match components/pricing.tsx.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Mediacrater",
      url: SITE,
      logo: `${SITE}/images/logo-mark-192.png`,
      email: "hello.mediacrater@gmail.com",
      sameAs: ["https://x.com/Mediacraterads", "https://www.instagram.com/mediacrater_official", "https://www.youtube.com/@Mediacrater"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Mediacrater",
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: "Mediacrater",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE,
      description:
        "Scans video and image ads for likely Meta, TikTok, YouTube, Pinterest and X policy issues, with timestamped findings and suggested fixes.",
      publisher: { "@id": `${SITE}/#organization` },
      offers: [
        { name: "Free", price: "0" },
        { name: "Startup", price: "10" },
        { name: "Established", price: "40" },
        { name: "Scaler", price: "80" },
        { name: "Agency", price: "200" },
      ].map((o) => ({ "@type": "Offer", name: o.name, price: o.price, priceCurrency: "USD" })),
    },
  ],
}

export default function Home() {
  return (
    <>
      <Header />
      <VerificationDialog />
      <main id="main-content">
        <JsonLd data={structuredData} />
        <Hero />
        <AdAccountInsurance />
        <Features />
        <HowItWorks />
        <SocialProof />
        <OwnYourAccounts />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
