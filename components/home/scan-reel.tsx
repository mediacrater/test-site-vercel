//components/home/scan-reel.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { Heart, MessageCircle, Send, Volume2 } from "lucide-react"

/*
 * The hero's example scan. A playhead sweeps a sample 15 second ad once,
 * findings appear as it reaches them, then the visitor can click any marker or
 * finding to jump to it, the same way the real results page works.
 * Everything here is illustrative and labeled as an example in the UI.
 */

type Severity = "high" | "medium" | "low"
type Region = "top" | "middle" | "subtitle" | "endcard"

interface Finding {
  id: string
  t: number
  lane: "video" | "audio"
  severity: Severity
  title: string
  source: string
  quote: string
  why: string
  fix: string
  region: Region
}

const DURATION = 15
const SCAN_MS = 3000
const START_DELAY_MS = 500

const FINDINGS: Finding[] = [
  {
    id: "results",
    t: 7,
    lane: "video",
    severity: "high",
    title: "Unrealistic results claim",
    source: "On-screen text",
    quote: "Clear skin in 3 days. Guaranteed.",
    why: "Promises a specific outcome within a set time.",
    fix: "Remove the time frame and the guarantee. Describe what the serum does.",
    region: "middle",
  },
  {
    id: "voiceover",
    t: 11,
    lane: "audio",
    severity: "medium",
    title: "Sensational voiceover",
    source: "Voiceover",
    quote: "Dermatologists don\u2019t want you to know this.",
    why: "Implies a hidden medical secret to provoke a reaction.",
    fix: "Cut the line, or replace it with a claim you can support.",
    region: "subtitle",
  },
  {
    id: "urgency",
    t: 13.5,
    lane: "video",
    severity: "low",
    title: "Countdown pressure",
    source: "End card",
    quote: "Ends in 09:59",
    why: "A timer that restarts for every viewer can read as false urgency.",
    fix: "Show a real end date, or remove the timer.",
    region: "endcard",
  },
]

const DEFAULT_SELECTION = "results"

// The stage is always dark, so it uses the dark-surface severity colors in both themes.
const SEV: Record<Severity, { label: string; color: string; soft: string }> = {
  high: { label: "High", color: "#FF7A66", soft: "rgba(255,122,102,0.14)" },
  medium: { label: "Medium", color: "#FFB054", soft: "rgba(255,176,84,0.14)" },
  low: { label: "Low", color: "#5BD28E", soft: "rgba(91,210,142,0.14)" },
}

const LIME = "#B8F23F"

function fmt(t: number) {
  const s = Math.max(0, Math.min(DURATION, Math.floor(t)))
  return `0:${String(s).padStart(2, "0")}`
}

function sceneAt(t: number): "a" | "b" | "c" | "d" {
  if (t < 4.5) return "a"
  if (t < 10) return "b"
  if (t < 12.5) return "c"
  return "d"
}

// Deterministic waveform so server and client render the same bars.
const WAVE = Array.from({ length: 76 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 1.71) * 0.6 + Math.sin(i * 0.43) * 0.4)
  const speech = i > 50 && i < 64 ? 0.25 : 0
  return Math.round((0.16 + Math.min(0.84, v * 0.9 + speech)) * 100)
})

export function ScanReel({ onComplete }: { onComplete?: () => void }) {
  const [time, setTime] = useState(0)
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finish = () => {
      const first = FINDINGS.find((f) => f.id === DEFAULT_SELECTION)!
      setPhase("done")
      setSelectedId(first.id)
      setTime(first.t)
      completeRef.current?.()
    }

    if (reduced) {
      finish()
      return
    }

    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const progress = Math.min(1, (now - start) / SCAN_MS)
      // Ease out slightly so the playhead settles instead of stopping dead.
      const eased = 1 - Math.pow(1 - progress, 1.6)
      setTime(eased * DURATION)
      if (progress < 1) raf = requestAnimationFrame(tick)
      else window.setTimeout(finish, 250)
    }
    const timer = window.setTimeout(() => {
      setPhase("scanning")
      raf = requestAnimationFrame(tick)
    }, START_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [])

  const done = phase === "done"
  const selected = FINDINGS.find((f) => f.id === selectedId) ?? null
  const scene = sceneAt(time)
  const highlight = done && selected ? selected : null
  const isRevealed = (f: Finding) => done || time >= f.t

  function select(f: Finding) {
    if (!done) return
    setSelectedId(f.id)
    setTime(f.t)
  }

  const counts = FINDINGS.reduce(
    (acc, f) => ({ ...acc, [f.severity]: acc[f.severity] + 1 }),
    { high: 0, medium: 0, low: 0 } as Record<Severity, number>
  )

  return (
    <figure
      className="relative overflow-hidden rounded-[28px] border border-ink-line bg-ink p-4 text-ink-text shadow-[0_50px_100px_-50px_rgba(11,22,40,0.65)] sm:p-6 lg:p-8"
      aria-label="Example scan of a sample ad"
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-10">
        <Creative scene={scene} highlight={highlight} />

        {/* Findings panel */}
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink-line pb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] py-1 pl-1.5 pr-3 text-sm font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/platform-icons/meta.png" alt="" width={18} height={18} className="h-[18px] w-[18px] rounded-full bg-white object-contain p-[2px]" />
              Meta
            </span>
            <span className="min-w-0 truncate text-sm text-ink-muted">serum_ugc_v3.mp4</span>
            <span className="ml-auto inline-flex items-center gap-2 text-sm font-semibold" aria-live="polite">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: done ? SEV.low.color : LIME,
                  animation: done || phase === "idle" ? undefined : "mc-ping 1.1s ease-out infinite",
                }}
                aria-hidden="true"
              />
              {done ? "Scan complete" : "Scanning"}
            </span>
          </div>

          <ul className="mt-3 flex flex-col gap-1" aria-label="Findings">
            {FINDINGS.map((f) => {
              const revealed = isRevealed(f)
              const active = done && selectedId === f.id
              return (
                <li key={f.id}>
                  {revealed ? (
                    <button
                      type="button"
                      onClick={() => select(f)}
                      disabled={!done}
                      aria-pressed={active}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:cursor-default ${
                        active ? "bg-white/[0.09]" : "hover:bg-white/[0.05]"
                      }`}
                      style={{ animation: done ? undefined : "mc-in 320ms ease-out both" }}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: SEV[f.severity].color }}
                        aria-hidden="true"
                      />
                      <span className="w-[4.25rem] shrink-0 text-sm font-semibold" style={{ color: SEV[f.severity].color }}>
                        {SEV[f.severity].label}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[0.95rem] font-semibold text-ink-text">{f.title}</span>
                      <span className="timecode shrink-0 text-sm text-ink-muted">{fmt(f.t)}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2.5" aria-hidden="true">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/10" />
                      <span className="h-3 w-[4.25rem] shrink-0 rounded bg-white/[0.06]" />
                      <span className="h-3 flex-1 rounded bg-white/[0.06]" />
                      <span className="h-3 w-9 shrink-0 rounded bg-white/[0.06]" />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Detail pane: fixed minimum height so nothing below it moves. */}
          <div className="mt-4 min-h-[13.5rem] rounded-2xl border border-ink-line bg-ink-2 p-4 sm:p-5">
            {selected ? (
              <div key={selected.id} className="animate-in fade-in-0 duration-300">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-lg font-bold leading-snug sm:text-xl">{selected.title}</p>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ color: SEV[selected.severity].color, background: SEV[selected.severity].soft }}
                  >
                    {SEV[selected.severity].label} risk
                  </span>
                </div>
                <p className="mt-3 text-sm text-ink-muted">
                  {selected.source} at <span className="timecode">{fmt(selected.t)}</span>
                </p>
                <p className="mt-1 text-[0.95rem] font-semibold">&ldquo;{selected.quote}&rdquo;</p>
                <dl className="mt-4 grid gap-3 text-[0.95rem] leading-relaxed sm:grid-cols-2 sm:gap-5">
                  <div>
                    <dt className="text-sm text-ink-muted">Why it was flagged</dt>
                    <dd className="mt-0.5">{selected.why}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-ink-muted">Suggested fix</dt>
                    <dd className="mt-0.5">{selected.fix}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-[0.95rem] leading-relaxed text-ink-muted">
                Findings appear as the scan reaches them. Each one comes with a timestamp, a risk level and a
                suggested fix.
              </p>
            )}
          </div>

          {done && (
            <p className="mt-3 text-sm text-ink-muted animate-in fade-in-0 duration-500">
              {counts.high} high, {counts.medium} medium, {counts.low} low. Select a finding or a marker to jump to it.
            </p>
          )}
        </div>
      </div>

      <Timeline time={time} done={done} selectedId={selectedId} isRevealed={isRevealed} onSelect={select} />

      <figcaption className="mt-5 text-[0.8125rem] text-ink-muted">
        Example scan of a sample ad. Your results depend on your creative and the platforms you select.
      </figcaption>
    </figure>
  )
}

/* ---------------- Timeline ---------------- */

function Timeline({
  time,
  done,
  selectedId,
  isRevealed,
  onSelect,
}: {
  time: number
  done: boolean
  selectedId: string | null
  isRevealed: (f: Finding) => boolean
  onSelect: (f: Finding) => void
}) {
  const pct = (time / DURATION) * 100

  const markers = (lane: "video" | "audio") =>
    FINDINGS.filter((f) => f.lane === lane && isRevealed(f)).map((f) => {
      const active = done && selectedId === f.id
      return (
        <button
          key={f.id}
          type="button"
          onClick={() => onSelect(f)}
          disabled={!done}
          aria-label={`${SEV[f.severity].label} risk at ${fmt(f.t)}: ${f.title}`}
          aria-pressed={active}
          className="absolute top-1/2 z-20 h-7 w-7 rounded-full disabled:cursor-default"
          style={{
            left: `${(f.t / DURATION) * 100}%`,
            transform: "translate(-50%, -50%)",
            animation: done ? undefined : "mc-pop 420ms cubic-bezier(.22,1,.36,1) both",
          }}
        >
          <span
            className="absolute left-1/2 top-1/2 block rounded-full transition-all duration-300"
            style={{
              width: active ? 18 : 13,
              height: active ? 18 : 13,
              transform: "translate(-50%, -50%)",
              background: SEV[f.severity].color,
              boxShadow: active ? `0 0 0 3px #0b1628, 0 0 0 5px ${SEV[f.severity].color}` : "0 0 0 3px #0b1628",
            }}
          />
        </button>
      )
    })

  return (
    <div className="mt-7 border-t border-ink-line pt-5">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-ink-muted">Timeline</span>
        <span className="timecode text-ink-text">
          {fmt(time)} <span className="text-ink-muted">/ {fmt(DURATION)}</span>
        </span>
      </div>

      <div className="flex gap-3">
        <div className="flex w-[3.25rem] shrink-0 flex-col gap-2.5 text-sm text-ink-muted">
          <span className="flex h-10 items-center">Video</span>
          <span className="flex h-10 items-center">Audio</span>
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="flex flex-col gap-2.5">
            <div className="relative h-10">
              <Filmstrip />
              {markers("video")}
            </div>
            <div className="relative h-10">
              <Waveform pct={pct} />
              {markers("audio")}
            </div>
          </div>

          <div className="relative mt-2 h-4 text-[0.75rem] text-ink-muted" aria-hidden="true">
            {[0, 5, 10, 15].map((s) => (
              <span
                key={s}
                className="timecode absolute top-0"
                style={{
                  left: `${(s / DURATION) * 100}%`,
                  transform: s === 0 ? "none" : s === 15 ? "translateX(-100%)" : "translateX(-50%)",
                }}
              >
                {fmt(s)}
              </span>
            ))}
          </div>

          {/* Playhead across both lanes */}
          <div
            className="pointer-events-none absolute -top-1.5 z-10 h-[calc(5.625rem+0.375rem)]"
            style={{ left: `${pct}%`, transition: done ? "left 520ms cubic-bezier(.22,1,.36,1)" : "none" }}
            aria-hidden="true"
          >
            <span className="absolute -left-[5px] -top-0.5 h-2.5 w-2.5 rounded-full" style={{ background: LIME }} />
            <span className="absolute left-0 top-0 h-full w-[2px] -translate-x-1/2 rounded-full" style={{ background: LIME }} />
          </div>
        </div>
      </div>
    </div>
  )
}

const FILM = [
  "a", "a", "a", "a", "a", "b", "b", "b", "b", "b", "c", "c", "d", "d", "d",
] as const

const SCENE_SWATCH: Record<string, string> = {
  a: "linear-gradient(160deg,#f1cdb9,#c98a7c 60%,#6b3c45)",
  b: "linear-gradient(160deg,#f5d9c7,#d99a85 55%,#8a4c50)",
  c: "linear-gradient(160deg,#d8a491,#9a5e60 60%,#4b2a39)",
  d: "linear-gradient(160deg,#3a2135,#5c2c40)",
}

function Filmstrip() {
  return (
    <div className="flex h-full overflow-hidden rounded-lg ring-1 ring-white/10">
      {FILM.map((s, i) => (
        <span key={i} className="h-full flex-1 border-r border-black/30 last:border-r-0" style={{ background: SCENE_SWATCH[s] }} />
      ))}
    </div>
  )
}

function Waveform({ pct }: { pct: number }) {
  return (
    <div className="flex h-full items-center gap-[2px] rounded-lg bg-white/[0.03] px-1 ring-1 ring-white/10">
      {WAVE.map((h, i) => {
        const played = (i / WAVE.length) * 100 <= pct
        return (
          <span
            key={i}
            className="flex-1 rounded-full"
            style={{ height: `${h}%`, background: played ? "#c9d6e8" : "rgba(147,163,186,0.35)" }}
          />
        )
      })}
    </div>
  )
}

/* ---------------- Sample creative ---------------- */

function Creative({ scene, highlight }: { scene: "a" | "b" | "c" | "d"; highlight: Finding | null }) {
  const ring = (region: Region) =>
    highlight?.region === region
      ? { boxShadow: `0 0 0 2px #0b1628, 0 0 0 4px ${SEV[highlight.severity].color}` }
      : undefined

  return (
    <div className="mx-auto w-[min(62vw,250px)] md:w-full" aria-hidden="true">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-[#2a1a24] ring-1 ring-white/10">
        {/* Scene backgrounds crossfade */}
        {(["a", "b", "c", "d"] as const).map((s) => (
          <div
            key={s}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ background: SCENE_BG[s], opacity: scene === s ? 1 : 0 }}
          />
        ))}

        {/* Product */}
        <div
          className="absolute left-1/2 transition-all duration-700 ease-out"
          style={{
            bottom: scene === "b" ? "14%" : "18%",
            width: scene === "b" ? "46%" : "36%",
            transform: `translateX(-50%) rotate(${scene === "a" ? -6 : scene === "c" ? 5 : 0}deg)`,
            opacity: scene === "d" ? 0 : 1,
          }}
        >
          <Bottle />
        </div>

        {/* Scene A: question caption */}
        <div
          className="absolute inset-x-[9%] top-[16%] flex justify-center transition-opacity duration-300"
          style={{ opacity: scene === "a" ? 1 : 0 }}
        >
          <span className="rounded-lg bg-white px-3 py-1.5 text-center text-[clamp(0.85rem,3.6vw,1.05rem)] font-extrabold leading-tight text-[#111]" style={ring("top")}>
            Struggling with acne?
          </span>
        </div>

        {/* Scene B: results claim */}
        <div
          className="absolute inset-x-[8%] top-[24%] flex justify-center transition-opacity duration-300"
          style={{ opacity: scene === "b" ? 1 : 0 }}
        >
          <span
            className="rounded-lg px-2 py-1 text-center font-display text-[clamp(1.05rem,4.6vw,1.45rem)] font-extrabold leading-[1.05] text-white"
            style={{ textShadow: "0 2px 0 #000, 0 0 12px rgba(0,0,0,.45)", ...ring("middle") }}
          >
            Clear skin in 3 days. Guaranteed.
          </span>
        </div>

        {/* Scene C: voiceover subtitle */}
        <div
          className="absolute inset-x-[7%] bottom-[7%] flex justify-center transition-opacity duration-300"
          style={{ opacity: scene === "c" ? 1 : 0 }}
        >
          <span className="inline-flex items-start gap-1.5 rounded-md bg-black/70 px-2.5 py-1.5 text-[clamp(0.72rem,3vw,0.85rem)] font-semibold leading-snug text-white" style={ring("subtitle")}>
            <Volume2 className="mt-[2px] h-3.5 w-3.5 shrink-0" />
            Dermatologists don&rsquo;t want you to know this.
          </span>
        </div>

        {/* Scene D: end card */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-[10%] text-center text-white transition-opacity duration-500"
          style={{ opacity: scene === "d" ? 1 : 0 }}
        >
          <p className="font-display text-[clamp(1.4rem,6vw,1.9rem)] font-extrabold leading-none">50% off today</p>
          <p className="timecode rounded-md px-2 py-0.5 text-[clamp(0.85rem,3.4vw,1rem)] font-bold text-[#ffd7a8]" style={ring("endcard")}>
            Ends in 09:59
          </p>
          <span className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#2a1a24]">Shop now</span>
        </div>

        {/* Social chrome */}
        <div className="absolute bottom-[26%] right-[5%] flex flex-col items-center gap-3 text-white/90 transition-opacity duration-300" style={{ opacity: scene === "d" ? 0 : 1 }}>
          <Heart className="h-5 w-5" />
          <MessageCircle className="h-5 w-5" />
          <Send className="h-5 w-5" />
        </div>
        <div className="absolute left-[6%] top-[5%] flex items-center gap-1.5 text-[0.7rem] font-semibold text-white/90">
          <span className="h-5 w-5 rounded-full bg-white/80" />
          sample.skincare
          <span className="font-normal text-white/70">Sponsored</span>
        </div>
      </div>
    </div>
  )
}

const SCENE_BG: Record<string, string> = {
  a: "radial-gradient(120% 80% at 30% 18%, #f3d3c2 0%, #e2a993 38%, #a8676a 72%, #4b2b3a 100%)",
  b: "radial-gradient(110% 75% at 60% 30%, #f7dfcf 0%, #e8b29c 40%, #b4716f 74%, #55303f 100%)",
  c: "radial-gradient(120% 90% at 40% 25%, #e0ab97 0%, #b77370 45%, #6e3d4b 80%, #2f1a28 100%)",
  d: "linear-gradient(165deg, #3a2135 0%, #5c2c40 55%, #2a1626 100%)",
}

function Bottle() {
  return (
    <svg viewBox="0 0 90 170" className="h-auto w-full drop-shadow-[0_18px_22px_rgba(40,15,20,0.45)]">
      <defs>
        <linearGradient id="mc-amber" x1="0" x2="1">
          <stop offset="0" stopColor="#7a3417" />
          <stop offset="0.45" stopColor="#c46d2c" />
          <stop offset="1" stopColor="#6a2b12" />
        </linearGradient>
        <linearGradient id="mc-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#a9834a" />
          <stop offset="0.5" stopColor="#ecd3a0" />
          <stop offset="1" stopColor="#9c7640" />
        </linearGradient>
      </defs>
      <rect x="33" y="0" width="24" height="40" rx="12" fill="#1d1517" />
      <rect x="28" y="35" width="34" height="15" rx="3" fill="url(#mc-gold)" />
      <rect x="36" y="49" width="18" height="10" fill="#6f3016" />
      <rect x="11" y="57" width="68" height="112" rx="17" fill="url(#mc-amber)" />
      <rect x="19" y="66" width="7" height="92" rx="3.5" fill="#fff" opacity="0.22" />
      <rect x="22" y="94" width="46" height="44" rx="4" fill="#f4ece1" />
      <text x="45" y="114" textAnchor="middle" fontSize="11" fontWeight="800" fill="#3a2418" fontFamily="var(--font-archivo), sans-serif">
        glow
      </text>
      <text x="45" y="127" textAnchor="middle" fontSize="6.5" fill="#6b5244" fontFamily="var(--font-hyper), sans-serif">
        serum 01
      </text>
    </svg>
  )
}
