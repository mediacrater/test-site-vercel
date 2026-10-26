//hooks/use-in-view.ts
"use client"

import { useEffect, useRef, useState } from "react"

/** True once the element has scrolled into view. Fires once, then disconnects. */
export function useInView<T extends Element>(options: IntersectionObserverInit = { threshold: 0.35 }) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setInView(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // options is static per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return { ref, inView }
}

/** Reads prefers-reduced-motion after mount (false during SSR). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}
