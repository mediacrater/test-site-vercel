"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/images/footer-logo.png" 
    : "/images/footer-logo-dark.png"

  return (
    <footer className="bg-foreground text-background py-12 font-mono text-xs border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-background/20">
          <div className="md:col-span-2 space-y-3">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="Mediacrater"
              width={160}
              height={40}
              className="h-10 w-auto rounded-none"
            />
            <p className="text-background/70 max-w-md leading-relaxed">
              Chrome extension compliance tool for ad creative auditing. Pre-submission risk assessment software.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-background mb-3 uppercase">[ Navigation ]</h3>
            <ul className="space-y-2 text-background/70">
              <li><Link href="#features" className="hover:text-background">Features</Link></li>
              <li><Link href="#how-it-works" className="hover:text-background">How It Works</Link></li>
              <li><Link href="/about" className="hover:text-background">About Us</Link></li>
              <li><Link href="#faq" className="hover:text-background">FAQ</Link></li>
              <li><Link href="/changelog" className="hover:text-background">Changelogs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-background mb-3 uppercase">[ Legal ]</h3>
            <ul className="space-y-2 text-background/70">
              <li><Link href="/privacy" className="hover:text-background">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-background">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-background">Refund Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-background">Cookie policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-b border-background/20 text-[10px] text-background/50 leading-relaxed font-sans">
          <strong>Disclaimer:</strong> Mediacrater provides non-binding policy compliance scores derived from publicly accessible platform guidelines. Final campaign approval resides strictly with respective platform algorithms (Meta, TikTok, Google, Pinterest, X). Mediacrater does not bypass or replace native platform detection systems.
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-background/60 text-[11px]">
          <p>© {currentYear} Mediacrater. All rights reserved.</p>
          <a
            href="https://www.instagram.com/mediacrater_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-background uppercase"
          >
            [ Instagram ]
          </a>
        </div>
      </div>
    </footer>
  )
}
