//components/header.tsx
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { ArrowUpRight, ChevronDown, LayoutDashboard, LogOut, Menu, Puzzle, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrandMark } from "@/components/brand-mark"
import { supabase } from "@/lib/mediacrater/supabaseClient"
import { EXTENSION_URL, YOUTUBE_DEMO_URL } from "@/lib/site-links"

const EXTENSION_LINK = EXTENSION_URL("website_header")

type NavLink = { href: string; label: string; external?: boolean }

const NAV_LINKS: NavLink[] = [
  { href: "/#features", label: "Features" },
  { href: YOUTUBE_DEMO_URL, label: "How it works", external: true },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
]

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const accountMenuId = useId()

  // Auth state: same shared Supabase client as the rest of the app, so this
  // reflects any session that already exists (dashboard, settings, etc.).
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
      setAuthLoaded(true)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Solid background and border once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Outside click closes the account menu; Escape closes any open menu.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDropdownOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKey)
    }
  }, [])

  async function handleSignOut() {
    setDropdownOpen(false)
    setMobileMenuOpen(false)
    await supabase.auth.signOut()
    router.push("/signin")
  }

  const initial = userEmail?.trim().charAt(0).toUpperCase() || "?"
  const solid = scrolled || mobileMenuOpen

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        solid ? "border-border bg-background/90 backdrop-blur-md" : "border-transparent bg-background/0"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>

      <nav aria-label="Main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[var(--header-h)] items-center justify-between gap-6">
          <BrandMark onClick={() => setMobileMenuOpen(false)} />

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                  {link.external && (
                    <>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only"> (opens YouTube in a new tab)</span>
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {authLoaded && userEmail ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-controls={accountMenuId}
                  className="flex max-w-[260px] items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/30"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[0.8rem] font-bold text-primary-foreground"
                  >
                    {initial}
                  </span>
                  <span className="truncate">{userEmail}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={accountMenuId}
                  role="menu"
                  hidden={!dropdownOpen}
                  className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-[0_16px_40px_-16px_rgba(11,22,40,0.45)] animate-in fade-in-0 zoom-in-95"
                >
                  <p className="truncate px-3 pb-2 pt-1.5 text-xs text-muted-foreground">Signed in as {userEmail}</p>
                  <Link
                    role="menuitem"
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Go to dashboard
                  </Link>
                  <a
                    role="menuitem"
                    href={EXTENSION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    <Puzzle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Get the Chrome extension
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  </a>
                  <div className="my-1.5 border-t border-border" />
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : authLoaded ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/signin"
                  className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-[0.95rem] font-semibold text-primary-foreground transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              // Holds the space while the session check resolves, so nothing jumps.
              <div className="h-10 w-[168px]" aria-hidden="true" />
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-controls={menuId}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div id={menuId} hidden={!mobileMenuOpen} className="md:hidden">
          <div className="border-t border-border pb-6 pt-3 animate-in fade-in-0 slide-in-from-top-2">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-lg font-medium text-foreground"
                  >
                    {link.label}
                    {link.external && <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </Link>
                </li>
              ))}
            </ul>

            {userEmail ? (
              <div className="mt-3 border-t border-border pt-4">
                <p className="truncate text-sm text-muted-foreground">Signed in as {userEmail}</p>
                <div className="mt-3 flex flex-col gap-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 text-base font-medium text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Go to dashboard
                  </Link>
                  <a
                    href={EXTENSION_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 py-2.5 text-base font-medium text-foreground"
                  >
                    <Puzzle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Get the Chrome extension
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 inline-flex h-11 items-center justify-center rounded-full border border-border text-base font-semibold text-destructive"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-5">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border text-base font-semibold text-foreground"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
