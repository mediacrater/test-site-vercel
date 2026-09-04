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
    <footer className="bg-foreground text-background py-12 font-mono text-xs border-t-4 border-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 border-r border-background/20 pr-8">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="Mediacrater"
              width={140}
              height={45}
              className="h-12 w-auto mb-4"
            />
            <p className="text-background/70 max-w-md leading-relaxed">
              &gt; The first comprehensive Chrome extension designed to be the final gatekeeper for your ad creatives. Scan before you upload. Protect your ad accounts.
            </p>
            <div className="mt-6 text-[10px] text-background/40">
              STATUS: ONLINE // SYSTEM_READY
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-background mb-4 uppercase tracking-widest border-b border-background/20 pb-2">/ directory</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-background/70 hover:text-background transition-colors before:content-['|-'] before:mr-2">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-background/70 hover:text-background transition-colors before:content-['|-'] before:mr-2">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-background/70 hover:text-background transition-colors before:content-['|-'] before:mr-2">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-background/70 hover:text-background transition-colors before:content-['|-'] before:mr-2">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-background/70 hover:text-background transition-colors before:content-['\_'] before:mr-2">
                  Changelogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-background mb-4 uppercase tracking-widest border-b border-background/20 pb-2">/ legal_sys</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-background/70 hover:text-background transition-colors before:content-['|-'] before:mr-2">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-background/70 hover:text-background transition-colors before:content-['|-'] before:mr-2">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-background/70 hover:text-background transition-colors before:content-['|-'] before:mr-2">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-background/70 hover:text-background transition-colors before:content-['\_'] before:mr-2">
                  Cookie policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-4 border border-background/20 bg-background/5">
          <p className="text-[10px] text-background/60 leading-relaxed uppercase">
            [SYS_DISCLAIMER]: Mediacrater does not make any promises or guarantees that a video ad will be approved. Our software provides a general confidence assessment based on publicly accessible ad policies. Your video is still subject to each platform's detection algorithms. Mediacrater does not replace, mirror, or bypass advertising detection algorithms of Facebook and Instagram (Meta), TikTok, YouTube, Google, Pinterest, or X. We are not affiliated with, endorsed by, or sponsored by any of these platforms. Platform logos are displayed solely for user experience. Mediacrater is not responsible for misuse of ad platforms or account bans.
          </p>
        </div>
        <div className="mt-4 p-4 border border-background/20 bg-background/5">
          <p className="text-[10px] text-background/60 leading-relaxed uppercase">
            *The "Get instant confidence scores and actionable fixes in 60 seconds" claim varies based on the length of your video and scan type.
          </p>
        </div>  
        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-background/20">
          <p className="text-[10px] text-background/50 uppercase">
            © {currentYear} Mediacrater. All rights reserved. // END_OF_FILE
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/mediacrater_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/60 hover:text-background transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
