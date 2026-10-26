//components/brand-mark.tsx
import Link from "next/link"

/**
 * Logo + wordmark. Both logo files are rendered and CSS shows the right one,
 * so there is no flash of the wrong logo while the theme loads.
 */
export function BrandMark({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 rounded-md ${className}`}
      aria-label="Mediacrater home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-mark-96.png" alt="" width={36} height={36} className="h-9 w-9 dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-mark-dark-96.png" alt="" width={36} height={36} className="hidden h-9 w-9 dark:block" />
      <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.01em] text-foreground">Mediacrater</span>
    </Link>
  )
}
