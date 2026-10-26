//components/home/morph-word.tsx
"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Swaps one word for another inside a headline: the new word drops in from above,
 * the old one leaves below, and the width eases to fit, so the rest of the line
 * slides into place. Widths are measured from the real font, so it works at
 * every breakpoint. Reduced motion: a plain crossfade.
 */
export function MorphWord({
  from,
  to,
  changed,
  reduced,
  duration = 1300,
}: {
  from: string
  to: string
  changed: boolean
  reduced: boolean
  duration?: number
}) {
  const fromRef = useRef<HTMLSpanElement>(null)
  const toRef = useRef<HTMLSpanElement>(null)
  const [widths, setWidths] = useState<{ from: number; to: number } | null>(null)

  useEffect(() => {
    const measure = () => {
      if (!fromRef.current || !toRef.current) return
      setWidths({ from: fromRef.current.offsetWidth, to: toRef.current.offsetWidth })
    }
    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const ease = "cubic-bezier(.22,1,.36,1)"
  const width = widths ? (changed ? widths.to : widths.from) : undefined

  return (
    <span
      className="relative inline-block whitespace-nowrap align-baseline"
      style={{
        width,
        transition: reduced ? "none" : `width ${duration}ms ${ease}`,
        // Clip sideways while the width animates; leave room for descenders.
        clipPath: "inset(-0.15em 0 -0.18em -0.05em)",
      }}
    >
      {/* In-flow ghost keeps the baseline and the line height. */}
      <span className="invisible">{changed ? to : from}</span>
      <span
        ref={toRef}
        className="absolute left-0 top-0"
        style={{
          transform: reduced || changed ? "translateY(0)" : "translateY(-145%)",
          opacity: reduced ? (changed ? 1 : 0) : 1,
          transition: `transform ${duration}ms ${ease}, opacity 300ms ease-out`,
        }}
      >
        {to}
      </span>
      <span
        ref={fromRef}
        className="absolute left-0 top-0"
        style={{
          transform: reduced || !changed ? "translateY(0)" : "translateY(145%)",
          opacity: reduced ? (changed ? 0 : 1) : 1,
          transition: `transform ${duration}ms ${ease}, opacity 300ms ease-out`,
        }}
      >
        {from}
      </span>
    </span>
  )
}
