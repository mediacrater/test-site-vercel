// app/ext-auth/page.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Script from "next/script"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: any) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID! // set this in Vercel

export default function ExtAuthPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const password = searchParams.get("password") || ""

  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const widgetIdRef = useRef<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!email || !password) {
      setStatus("error")
      setErrorMsg("Missing credentials.")
      return
    }
  }, [email, password])

  function onTurnstileLoad() {
    if (!containerRef.current || !window.turnstile) return
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
      callback: async (token: string) => {
        setStatus("working")
        try {
          const res = await fetch("/api/ext_signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, turnstileToken: token }),
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || "Sign in failed")

          // Send session back to the extension
          if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
            chrome.runtime.sendMessage(
              EXTENSION_ID,
              { type: "MEDIACRATER_EXT_SIGNIN_RESULT", success: true, session: data.session },
              () => {
                // ignore lastError; tab will close anyway
              }
            )
          }
          setStatus("done")
          // give the extension a moment to receive the message
          setTimeout(() => window.close(), 400)
        } catch (err: any) {
          setStatus("error")
          setErrorMsg(err.message || "Sign in failed")
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current)
          }
        }
      },
      "error-callback": () => {
        setStatus("error")
        setErrorMsg("Verification failed. Please try again.")
      },
    })
  }

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 360, margin: "40px auto", textAlign: "center" }}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={onTurnstileLoad}
      />
      <h2>Sign in to Mediacrater</h2>
      {status === "idle" && <p>Complete the check below…</p>}
      {status === "working" && <p>Signing in…</p>}
      {status === "done" && <p>Success. This window will close.</p>}
      {status === "error" && <p style={{ color: "crimson" }}>{errorMsg}</p>}
      <div ref={containerRef} style={{ marginTop: 16 }} />
    </div>
  )
}
