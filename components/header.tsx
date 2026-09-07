"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, ChevronDown } from "lucide-react"
import { supabase } from "@/lib/mediacrater/supabaseClient"

const EXTENSION_LINK = "https://chromewebstore.google.com/detail/mediacrater-ad-compliance/fgekklkpomdcadiaekpigidkimnkjpnf?utm_medium=website_header"

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
      setAuthLoaded(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleSignOut() {
    setDropdownOpen(false)
    setMobileMenuOpen(false)
    await supabase.auth.signOut()
    router.push("/signin")
  }

  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/images/header-logo-dark.png"
    : "/images/header-logo.png"

  const navLinks = [
    { href: "#features", label: "Product" },
    { href: "#how-it-works", label: "Workflow" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="border-b border-amber-500/20 bg-amber-500/5 px-4 py-2 text-center text-[11px] font-medium text-amber-700 dark:text-amber-300">
        Major update underway: expect intermittent delays.
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={logoSrc} alt="Mediacrater Logo" width={36} height={36} className="h-9 w-9" />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-foreground">
              Mediacrater
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {authLoaded && userEmail ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex max-w-[220px] items-center gap-1.5 border-l border-border pl-4 text-[13px] font-medium text-foreground"
                >
                  <span className="truncate">{userEmail}</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 border border-border bg-card py-1 shadow-xl">
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-secondary">
                      Go to dashboard
                    </Link>
                    <div className="my-1 border-t border-border" />
                    <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-secondary">
                      Get the Chrome extension ↗
                    </a>
                    <div className="my-1 border-t border-border" />
                    <button type="button" onClick={handleSignOut} className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-secondary">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : authLoaded ? (
              <div className="flex items-center gap-2 border-l border-border pl-4">
                <Link href="/signin" className="px-2 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground">
                  Log in
                </Link>
                <Button asChild size="sm" className="rounded-md px-4">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            ) : (
              <div className="w-[128px] h-9" />
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button type="button" className="p-2 text-muted-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-5 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              ))}
              {userEmail ? (
                <>
                  <div className="border-t border-border pt-4 text-sm font-medium">{userEmail}</div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm text-muted-foreground">Go to dashboard</Link>
                  <a href={EXTENSION_LINK} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground">Get the Chrome extension ↗</a>
                  <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <Button asChild variant="outline"><Link href="/signin" onClick={() => setMobileMenuOpen(false)}>Log in</Link></Button>
                  <Button asChild><Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign up</Link></Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
