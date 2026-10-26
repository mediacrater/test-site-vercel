//components/legal/policy-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { POLICIES } from "@/lib/legal/policies"

/**
 * Policy navigation. Desktop: sticky vertical list with a bar on the current page.
 * Mobile: a horizontal strip that scrolls, with the current page filled in.
 * The current page also gets aria-current="page" for screen readers.
 */
export function PolicyNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Policies">
      {/* Mobile strip */}
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {POLICIES.map((p) => {
          const active = pathname === p.href
          return (
            <li key={p.href} className="shrink-0">
              <Link
                href={p.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-full border px-4 text-[0.95rem] font-semibold transition-colors ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                {p.navLabel}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Desktop list */}
      <div className="hidden lg:block">
        <p className="mb-4 text-sm font-semibold text-muted-foreground">Policies</p>
        <ul className="relative border-l-2 border-border">
          {POLICIES.map((p) => {
            const active = pathname === p.href
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative -ml-[2px] flex border-l-2 py-2.5 pl-5 text-[1.0625rem] leading-snug transition-colors ${
                    active
                      ? "border-primary font-bold text-foreground"
                      : "border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {p.navLabel}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
