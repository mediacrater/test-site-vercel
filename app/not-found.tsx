"use client" // Added client directive for theme detection

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, AlertTriangle, Shield, Zap, Info } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme-aware logo logic
  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/images/header-logo-dark.png" 
    : "/images/header-logo.png"

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <Link href="/" className="inline-block mb-8">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="Mediacrater"
            width={180}
            height={60}
            className="h-12 w-auto mx-auto"
          />
        </Link>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm font-medium">Error 404: Disapproved URL</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-display)]">
          Campaign Interrupted
        </h1>

        {/* Humorous message */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            Looks like this page got{" "}
            <span className="text-destructive font-semibold">rejected</span> harder than an ad with unverified health claims.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Don't worry. Unlike a permanent Meta ban, this is easy to appeal. Just head back home.
          </p>
        </div>

        {/* Fun "rejection reason" box */}
        <div className="text-left bg-secondary/50 rounded-lg p-5 mb-8 border-l-4 border-primary shadow-inner">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-2">
            Policy Violation Found
          </p>
          <p className="text-sm font-medium">
            {"The URL you requested violates our 'Pages That Actually Exist' guidelines."}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Confidence Score:</span>
            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-destructive w-[5%]" />
            </div>
            <span className="text-xs font-bold text-destructive">0 / 100</span>
          </div>
        </div>

        {/* CTA Section with more links for SEO */}
        <div className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Back to Homepage
                </Link>
            </Button>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
                <Button variant="outline" asChild size="sm" className="text-xs">
                    <Link href="/#pricing">View Pricing</Link>
                </Button>
                <Button variant="outline" asChild size="sm" className="text-xs">
                    <Link href="/#faq">Get Help</Link>
                </Button>
            </div>
        </div>

        {/* Final Zinger */}
        <p className="mt-10 text-xs text-muted-foreground">
          Pro tip: Unlike most ad platforms, we actually tell you why your URL failed.
        </p>
      </div>
    </main>
  )
}
