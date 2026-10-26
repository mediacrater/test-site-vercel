//lib/legal/policies.ts
// Single list of policy pages. The policy side nav, the footer's Legal column and
// app/sitemap.ts all read from here, so a new policy only needs to be added once.

export interface PolicyLink {
  href: string
  /** Full name, used in the footer and as the page title. */
  label: string
  /** Shorter name for the side nav. */
  navLabel: string
}

export const POLICIES: PolicyLink[] = [
  { href: "/privacy", label: "Privacy Policy", navLabel: "Privacy" },
  { href: "/chrome-extension-privacy", label: "Extension Privacy Policy", navLabel: "Extension privacy" },
  { href: "/terms", label: "Terms of Service", navLabel: "Terms of service" },
  { href: "/refund", label: "Refund Policy", navLabel: "Refunds" },
  { href: "/cookies", label: "Cookie Policy", navLabel: "Cookies" },
  { href: "/ip-rights", label: "IP Rights Policy", navLabel: "IP rights" },
]

export const CONTACT_EMAIL = "hello.mediacrater@gmail.com"
