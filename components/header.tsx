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

const EXTENSION_LINK = "https://mediacrater.com/signup"

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    { href: "#features", label: "Features" },
    { href: "https://www.youtube.com/watch?v=Jk_XtsN1N9I?utm_medium=website_how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-center py-1.5 px-4 text-xs font-mono border-b border-border tracking-tight uppercase">
        System update underway: expect potential minor processing delays.
      </div>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="Mediacrater Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-none object-contain"
            />
            <span className="text-lg font-bold tracking-tight uppercase text-foreground font-mono">
              Mediacrater
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6 border-x border-border px-6 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            <ThemeToggle />
            {authLoaded && userEmail ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-xs font-mono border border-border px-3 py-1.5 text-foreground hover:bg-secondary rounded-none"
                >
                  <span className="truncate max-w-[150px]">{userEmail}</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 rounded-none border border-border bg-card py-1 z-50 shadow-none">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-mono text-foreground hover:bg-secondary"
                    >
                      Dashboard
                    </Link>
                    <div className="my-1 border-t border-border" />
                    <a
                      href={EXTENSION_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-mono text-foreground hover:bg-secondary"
                    >
                      Extension ↗
                    </a>
                    <div className="my-1 border-t border-border" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-xs font-mono text-red-600 dark:text-red-400 hover:bg-secondary"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : authLoaded ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="text-xs font-mono border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-none"
                >
                  Log in
                </Link>
                <Button asChild className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-mono px-4 py-1.5 h-auto">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            ) : (
              <div className="w-[120px] h-8" />
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="p-1.5 border border-border text-muted-foreground hover:text-foreground rounded-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-3 font-mono text-xs">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {userEmail ? (
                <>
                  <div className="text-foreground truncate pt-2 border-t border-border">
                    {userEmail}
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" className="rounded-none mt-2 text-xs font-mono">
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <Button asChild variant="outline" className="rounded-none text-xs font-mono">
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="rounded-none bg-primary text-primary-foreground text-xs font-mono">
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
