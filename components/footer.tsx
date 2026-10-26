//components/footer.tsx
import Link from "next/link"
import { CONTACT_EMAIL, POLICIES } from "@/lib/legal/policies"

const PRODUCT = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/changelog", label: "Changelog" },
]

const RESOURCES = [
  { href: "/tools", label: "Free tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About us" },
  { href: "/solutions", label: "Custom solutions" },
]

const SOCIAL = [
  {
    href: "https://x.com/Mediacraterads",
    label: "Mediacrater on X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    fill: true,
  },
  {
    href: "https://www.instagram.com/mediacrater_official",
    label: "Mediacrater on Instagram",
    path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm9 9.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01",
    fill: false,
  },
  {
    href: "https://www.youtube.com/@Mediacrater",
    label: "Mediacrater on YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    fill: true,
  },
]

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-[0.95rem] font-bold text-ink-text">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[0.975rem] text-ink-muted transition-colors hover:text-ink-text">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink text-ink-text dark:border-t dark:border-ink-line">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 md:pt-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Mediacrater home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-mark-dark-96.png" alt="" width={40} height={40} className="h-10 w-10" />
              <span className="font-display text-xl font-extrabold">Mediacrater</span>
            </Link>
            <p className="mt-5 max-w-[34ch] text-[1rem] leading-relaxed text-ink-muted">
              Scan video and image ads for likely policy issues before you upload. Protect your ad accounts.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-block text-[0.975rem] font-semibold text-ink-text underline decoration-ink-muted underline-offset-4 hover:decoration-ink-text"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 md:col-span-8">
            <Column title="Product" links={PRODUCT} />
            <Column title="Resources" links={RESOURCES} />
            <Column title="Legal" links={POLICIES.map((p) => ({ href: p.href, label: p.label }))} />
          </div>
        </div>

        <div className="mt-16 border-t border-ink-line pt-8">
          <p className="max-w-[110ch] text-[0.8125rem] leading-relaxed text-ink-muted">
            <strong className="font-semibold text-ink-text">Disclaimer:</strong> Mediacrater does not make any promises
            or guarantees that a video ad will be approved. Our software provides a general risk assessment based on
            publicly accessible ad policies. Your video is still subject to each platform&rsquo;s detection algorithms.
            Mediacrater does not replace, mirror, or bypass advertising detection algorithms of Facebook and Instagram
            (Meta), TikTok, YouTube, Google, Pinterest, or X. We are not affiliated with, endorsed by, or sponsored by any
            of these platforms. Platform logos are displayed solely for user experience. Mediacrater is not responsible
            for misuse of ad platforms or account bans.
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-sm text-ink-muted">&copy; {currentYear} Mediacrater. All rights reserved.</p>
          <ul className="flex items-center gap-2">
            {SOCIAL.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink-text"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill={s.fill ? "currentColor" : "none"}
                    stroke={s.fill ? "none" : "currentColor"}
                    strokeWidth={s.fill ? undefined : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
