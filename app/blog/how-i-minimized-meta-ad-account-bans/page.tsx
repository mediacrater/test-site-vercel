//app/blog/how-i-minimized-meta-ad-account-bans/page.tsx
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogPostShell } from "@/components/blog/blog-post-shell"
import { A, Callout, Fill, H2, LI, P, UL } from "@/components/blog/prose"
import { blogSignupUrl, getPost, isPostVisible } from "@/lib/blog/registry"

const post = getPost("how-i-minimized-meta-ad-account-bans")
const path = `/blog/${post.slug}`

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: path },
  // Drafts must never be indexed, even if someone finds the URL.
  robots: post.status === "draft" ? { index: false, follow: false } : undefined,
  // Child openGraph replaces the layout's openGraph entirely, so the image and site name are repeated here.
  openGraph: {
    title: post.title,
    description: post.description,
    url: path,
    type: "article",
    siteName: "Mediacrater",
    locale: "en_US",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: post.headline }],
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: post.description,
    images: ["/images/og-image.png"],
  },
}

export default function Page() {
  if (!isPostVisible(post)) notFound()

  return (
    <BlogPostShell
      post={post}
      ctaText="Meta won't tell you which part of an ad caused a rejection. Check the creative before you upload it."
      disclosure={
        <>
          <p>
            Disclosure: Affiliate links are included in this page.
          </p>
          <p className="mt-2">
            Nothing here guarantees your account stays safe. Platform rules change, and I am basing
            the difference off of visible patterns I have experieneced with Meta and the resources listed below.
          </p>
        </>
      }
    >
      <P>
        I&apos;ve run Meta ads since 2019 and had dozens of ad accounts banned. Even then I was clueless as to why, because
        Meta never told me what I was doing wrong. It became trial and error.
        These are the three habits that came with fewer bans for me.
      </P>

      <H2 id="stable-ip">1. I stopped my IP address from changing</H2>
      <P>
        My internet provider rotated my home IP address every month, so my logins kept appearing from different
        addresses. I can&apos;t prove this caused my bans, but they stopped after I fixed it.{" "}
        When I started using fixed IP addresses I noticed that random ad account bans as soon as I logged in no longer
        were happening to me anymore.
      </P>
      <P>There are two ways to get a stable IP:</P>
      <UL>
        <LI>
          <strong>Ask your internet provider for a static IP.</strong> This is the safest route, because no third
          party sits between you and your ad account.
        </LI>
        <LI>
          <strong>Use a dedicated static residential IP from a service.</strong> I used 
            <a href="https://www.myprivateproxy.net/billing/aff.php?aff=4193" className="underline">
              MyPrivateProxy
            </a> 
          along with an anti detect browser called 
            <a href="https://incogniton.com/aff/1929570/" className="underline">
              Icnogniton
            </a>. 
          These were my go to services when dealing with Meta directly with advertising. It has worked for me for a long time.
        </LI>
      </UL>
      <Callout title="If you use an IP service, know the risks">
        <p>
          You&apos;re routing your ad account logins through a third party. Shared or datacenter IPs may already be
          flagged because of what other people did on them. Pick a reputable provider, make sure the IP is dedicated
          to you, and turn on two-factor authentication on your Facebook account and Business Manager before you
          log in through it.
        </p>
      </Callout>

      <H2 id="payment-method">2. I waited 24 hours after changing my payment method</H2>
      <P>
        Whenever I updated a payment method, I held off spending for 24 hours unless I had to. I didn&apos;t want
        a new payment method and a sudden jump in spend to show up at the same time.
      </P>
      <P>
        Meta doesn&apos;t publish this as a rule. It&apos;s my own habit, and I&apos;m sharing it as one.
      </P>

      <H2 id="check-ads">3. I checked my ads before uploading them</H2>
      <P>
        Many rejections come from the creative itself, such as a line that sounds like a guaranteed result.{" "}
        This is why I built Mediacrater.
      </P>
      <P>
        Mediacrater scans video and image ads for likely Meta, TikTok and Google policy issues and shows findings with
        timestamps and suggested fixes. It can&apos;t guarantee approval and it doesn&apos;t check account-level
        problems like billing, verification or your landing page. What it does is flag creative risks before you put
        money behind an ad. You get <A href={blogSignupUrl(post.slug)}>3 free scans a month</A>.
      </P>

      <H2 id="limits">The honest limits</H2>
      <P>
        These habits worked for me over a year, which has garnered me far more success than anything I've tried before. 
        They&apos;re not a guarantee, and bans still came my way, but for things inside of my creatives that I had no idea
        I was doing wrong. After building Mediacrater, fine tuning the output with many media files, I now see where and how
        I went wrong.
      </P>
      <P>
        If you&apos;re deciding between renting an agency ad account and building your own,{" "}
        <A href="/#own-your-accounts">here&apos;s how the two compare</A>.
      </P>
    </BlogPostShell>
  )
}
