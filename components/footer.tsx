"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/images/footer-logo.png"
    : "/images/footer-logo-dark.png"

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_0.75fr_0.75fr]">
          <div>
            <Image src={logoSrc} alt="Mediacrater" width={180} height={60} className="h-12 w-auto" />
            <p className="mt-5 max-w-lg text-sm leading-6 text-background/55">
              Pre-publish compliance analysis for paid media creatives. Identify potential policy risk before putting budget behind the asset.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-background/80">Navigate</h3>
            <ul className="mt-4 space-y-3 text-sm text-background/55">
              <li><Link href="#features" className="hover:text-background">Product</Link></li>
              <li><Link href="#how-it-works" className="hover:text-background">Workflow</Link></li>
              <li><Link href="#pricing" className="hover:text-background">Pricing</Link></li>
              <li><Link href="#faq" className="hover:text-background">FAQ</Link></li>
              <li><Link href="/about" className="hover:text-background">About Us</Link></li>
              <li><Link href="/changelog" className="hover:text-background">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-background/80">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-background/55">
              <li><Link href="/privacy" className="hover:text-background">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-background">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-background">Refund Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-background">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-background/15 pt-7">
          <p className="max-w-5xl text-[10px] leading-5 text-background/40">
            <strong className="text-background/60">Disclaimer:</strong> Mediacrater does not promise or guarantee that a video ad will be approved. Our software provides a general confidence assessment based on publicly accessible ad policies. Your creative remains subject to each platform's proprietary detection and enforcement systems. Mediacrater does not replace, mirror, or bypass advertising detection algorithms and is not affiliated with, endorsed by, or sponsored by Meta, TikTok, YouTube, Google, Pinterest, or X.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-background/15 pt-7 text-xs text-background/40 sm:flex-row">
          <p>© {currentYear} Mediacrater. All rights reserved.</p>
          <a href="https://www.instagram.com/mediacrater_official/" target="_blank" rel="noopener noreferrer" className="hover:text-background">
            Instagram ↗
          </a>
        </div>
      </div>
    </footer>
  )
}
