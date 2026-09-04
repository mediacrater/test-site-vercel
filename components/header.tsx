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
    { href: "#features", label: "/features" },
    { href: "https://www.youtube.com/watch?v=Jk_XtsN1N9I?utm_medium=website_how-it-works", label: "/how_it_works" },
    { href: "#pricing", label: "/pricing" },
    { href: "#faq", label: "/faq" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border font-mono text-xs">
      <div className="bg-amber-500 text-black text-center py-1.5 px-4 font-bold uppercase tracking-widest text-[9px] border-b border-amber-600">
        ! SYS_WARNING: Major update underway: expect intermittent delays.
      </div>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="Mediacrater Logo"
              width={24}
              height={24}
              className="h-6 w-6 rounded-none"
            />
            <span className="font-bold text-foreground uppercase tracking-widest">
              Mediacrater
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6 border-l border-r border-border h-full px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-muted-foreground hover:text-foreground transition-colors uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <ThemeToggle />
            {authLoaded && userEmail ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 font-medium text-foreground hover:text-muted-foreground transition-colors max-w-[220px] bg-secondary/50 px-3 py-1.5 border border-border"
                >
                  <span className="truncate">USER:{userEmail}</span>
                  <ChevronDown className="h-3 w-3 flex-shrink-0" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-56 border border-border bg-card shadow-none z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-foreground hover:bg-secondary transition-colors uppercase"
                    >
                      &gt; Dashboard
                    </Link>
                    <div className="border-t border-dashed border-border" />
                    <a
                      href={EXTENSION_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-foreground hover:bg-secondary transition-colors uppercase"
                    >
                      &gt; Get Extension
                    </a>
                    <div className="border-t border-dashed border-border" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-destructive hover:bg-secondary transition-colors uppercase font-bold"
                    >
                      [ SIGN_OUT ]
                    </button>
                  </div>
                )}
              </div>
            ) : authLoaded ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 uppercase"
                >
                  [ LOG_IN ]
                </Link>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase text-xs h-8 px-4">
                  <Link href="/signup">RUN ./SIGN_UP</Link>
                </Button>
              </div>
            ) : (
              <div className="w-[140px] h-8" />
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="p-1.5 border border-border text-muted-foreground hover:text-foreground bg-card"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="p-2 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {userEmail ? (
                <div className="mt-4 border border-border p-2 bg-secondary/20">
                  <div className="font-bold text-foreground truncate mb-2 text-[10px]">
                    ACTIVE_USER: {userEmail}
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-muted-foreground hover:text-foreground transition-colors uppercase"
                  >
                    &gt; Dashboard
                  </Link>
                  <a
                    href={EXTENSION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 text-muted-foreground hover:text-foreground transition-colors uppercase"
                  >
                    &gt; Get Extension
                  </a>
                  <Button onClick={handleSignOut} variant="outline" className="mt-2 w-full rounded-none border-destructive text-destructive uppercase text-xs h-8">
                    [ TERMINATE_SESSION ]
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4">
                  <Button asChild variant="outline" className="rounded-none uppercase text-xs">
                    <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                      [ LOG_IN ]
                    </Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase text-xs">
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      RUN ./SIGN_UP
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
