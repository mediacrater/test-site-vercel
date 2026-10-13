//app/tools/video-metadata-remover/tool.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { cleanFile, scanFile, type CleanResult, type Finding, type ScanResult } from "@/lib/tools/metadata-cleaner"

const ACCEPT = ".jpg,.jpeg,.png,.mp4,.mov,.m4v,image/jpeg,image/png,video/mp4,video/quicktime"

function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function cleanName(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? `${name.slice(0, dot)}-clean${name.slice(dot)}` : `${name}-clean`
}

function FindingList({ findings }: { findings: Finding[] }) {
  return (
    <ul className="mt-3 divide-y divide-border rounded-lg border border-border bg-background">
      {findings.map((f, i) => (
        <li key={`${f.label}-${i}`} className="flex flex-col gap-0.5 p-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <span className="text-sm font-medium">
            {f.label}
            {f.removable === false && <span className="ml-2 text-xs font-normal text-muted-foreground">(can't be removed)</span>}
          </span>
          {f.value && <span className="break-all font-mono text-xs text-muted-foreground sm:text-right">{f.value}</span>}
        </li>
      ))}
    </ul>
  )
}

export function MetadataCleaner() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [scan, setScan] = useState<ScanResult | null>(null)
  const [busy, setBusy] = useState<"reading" | "cleaning" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState<{
    url: string
    name: string
    method: CleanResult["method"]
    remaining: Finding[]
  } | null>(null)

  // Free the download link's memory when it's replaced or the page closes.
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url) }, [result])

  async function handleFile(f: File) {
    setError(null)
    setResult(null)
    setScan(null)
    setFile(f)
    setBusy("reading")
    try {
      const s = await scanFile(f)
      if (!s) throw new Error("Unsupported file. Use a JPG, PNG, MP4 or MOV file.")
      setScan(s)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't read this file.")
      setFile(null)
    } finally {
      setBusy(null)
    }
  }

  async function handleClean() {
    if (!file) return
    setError(null)
    setBusy("cleaning")
    try {
      const cleaned = await cleanFile(file)
      const check = await scanFile(cleaned.blob) // verify the result
      setResult({
        url: URL.createObjectURL(cleaned.blob),
        name: cleanName(file.name),
        method: cleaned.method,
        remaining: check?.findings ?? [],
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't clean this file.")
    } finally {
      setBusy(null)
    }
  }

  function reset() {
    setFile(null)
    setScan(null)
    setResult(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const removableCount = scan?.findings.filter((f) => f.removable !== false).length ?? 0

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
      {!file && (
        <label
          htmlFor="metadata-file"
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const f = e.dataTransfer.files[0]
            if (f) handleFile(f)
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary"
          }`}
        >
          <span className="font-semibold">Choose a video or photo</span>
          <span className="mt-1 text-sm text-muted-foreground">or drop it here · MP4, MOV, JPG, PNG</span>
          <input
            ref={inputRef}
            id="metadata-file"
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
        </label>
      )}

      {busy === "reading" && <p className="mt-4 text-sm text-muted-foreground">Reading file…</p>}

      {error && (
        <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">{error}</p>
      )}

      {file && scan && (
        <div aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            <button type="button" onClick={reset} className="shrink-0 text-xs text-muted-foreground underline hover:text-foreground">
              Choose another file
            </button>
          </div>

          <p className="mt-5 text-sm font-semibold">
            {scan.findings.length === 0
              ? "No metadata found"
              : `Found ${scan.findings.length} metadata ${scan.findings.length === 1 ? "item" : "items"}`}
          </p>
          {scan.findings.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">None of the metadata types this tool checks are in this file.</p>
          ) : (
            <FindingList findings={scan.findings} />
          )}

          {!result && removableCount > 0 && (
            <button
              type="button"
              onClick={handleClean}
              disabled={busy !== null}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto"
            >
              {busy === "cleaning" ? "Removing…" : "Remove metadata"}
            </button>
          )}

          {result && (
            <div className="mt-6 rounded-lg border border-border bg-background p-4">
              <a
                href={result.url}
                download={result.name}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:w-auto"
              >
                Download clean file
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                {result.method === "lossless"
                  ? "Lossless: the image or video data wasn't changed. Only metadata was removed."
                  : "This photo relied on a rotation flag, so it was redrawn upright and re-saved at high quality. Its colour profile was converted to sRGB."}
              </p>
              <p className="mt-4 text-sm font-semibold">Check of the cleaned file</p>
              {result.remaining.length === 0 ? (
                <p className="mt-1 text-sm text-muted-foreground">No metadata left.</p>
              ) : (
                <FindingList findings={result.remaining} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
