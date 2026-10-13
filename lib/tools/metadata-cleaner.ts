//lib/tools/metadata-cleaner.ts
/**
 * Metadata inspector & cleaner for JPEG, PNG, MP4 and MOV.
 * Runs entirely in the browser. Nothing is uploaded, nothing is stored.
 *
 * How cleaning works:
 *  - JPEG: removes EXIF, XMP, IPTC and comment segments without touching the image data.
 *    If the photo relies on an EXIF rotation flag, it's redrawn upright instead, so it
 *    doesn't turn sideways once the flag is gone.
 *  - PNG: removes text, EXIF and timestamp chunks without touching the image data.
 *  - MP4/MOV: overwrites metadata boxes with empty "free" boxes of the SAME size and
 *    zeroes the creation dates. Nothing moves, so video and audio are untouched, and
 *    only the small header is loaded into memory, even for multi-GB files.
 */

export type FileKind = "jpeg" | "png" | "video"

export interface Finding {
  label: string
  value?: string
  removable?: false // detected, but can't be removed without re-encoding
}

export interface ScanResult {
  kind: FileKind
  findings: Finding[]
}

export interface CleanResult {
  blob: Blob
  method: "lossless" | "redrawn"
}

const MAX_IMAGE_BYTES = 50 * 1024 * 1024 // images are read fully into memory
const MAX_HEADER_BYTES = 100 * 1024 * 1024 // video header only; video data is never loaded

const latin1 = new TextDecoder("latin1")
const utf8 = new TextDecoder("utf-8")

const view = (b: Uint8Array) => new DataView(b.buffer, b.byteOffset, b.byteLength)
const fourcc = (b: Uint8Array, at: number) => latin1.decode(b.subarray(at, at + 4))
const startsWith = (b: Uint8Array, at: number, text: string) =>
  latin1.decode(b.subarray(at, at + text.length)) === text

/** Makes a value safe and short for display. Binary data is shown as "Present". */
function display(raw: string): string | undefined {
  const t = raw.replace(/\0+$/g, "").trim()
  if (!t) return undefined
  if (/[\u0000-\u0008\u000E-\u001F\uFFFD]/.test(t)) return "Present"
  return t.length > 120 ? `${t.slice(0, 117)}…` : t
}

function dedupe(list: Finding[]): Finding[] {
  const seen = new Set<string>()
  return list.filter((f) => {
    const key = `${f.label}|${f.value ?? ""}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function readImage(file: Blob): Promise<Uint8Array> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Images larger than 50 MB aren't supported.")
  return new Uint8Array(await file.arrayBuffer())
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const VIDEO_FIRST_BOXES = new Set(["ftyp", "wide", "moov", "mdat", "free", "skip"])

/** Identifies the file by its first bytes, never by its name or extension. */
export async function detectKind(file: Blob): Promise<FileKind | null> {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (b.length < 8) return null
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg"
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png"
  if (VIDEO_FIRST_BOXES.has(fourcc(b, 4))) return "video"
  return null
}

export async function scanFile(file: Blob): Promise<ScanResult | null> {
  const kind = await detectKind(file)
  if (kind === "jpeg") return { kind, findings: scanJpeg(await readImage(file)).findings }
  if (kind === "png") return { kind, findings: processPng(await readImage(file)).findings }
  if (kind === "video") return { kind, findings: (await processVideo(file, false)).findings }
  return null
}

export async function cleanFile(file: Blob): Promise<CleanResult> {
  const kind = await detectKind(file)
  if (kind === "jpeg") return cleanJpeg(file)
  if (kind === "png") {
    const { parts } = processPng(await readImage(file))
    return { blob: new Blob(parts, { type: "image/png" }), method: "lossless" }
  }
  if (kind === "video") {
    const { parts } = await processVideo(file, true)
    return { blob: new Blob(parts, { type: file.type || "video/mp4" }), method: "lossless" }
  }
  throw new Error("Unsupported file. Use a JPG, PNG, MP4 or MOV file.")
}

// ---------------------------------------------------------------------------
// JPEG
// ---------------------------------------------------------------------------

interface Segment {
  marker: number
  start: number
  end: number
}

/** Splits a JPEG into its header segments, the image data, and anything after the image. */
function jpegLayout(b: Uint8Array) {
  const segments: Segment[] = []
  let i = 2 // skip start-of-image marker
  while (i + 4 <= b.length) {
    if (b[i] !== 0xff) throw new Error("This JPEG looks damaged.")
    const marker = b[i + 1]
    if (marker === 0xff) { i++; continue } // padding byte
    if (marker === 0xda || marker === 0xd9) break // image data starts / image ends
    const end = i + 2 + ((b[i + 2] << 8) | b[i + 3])
    if (end > b.length || end < i + 4) throw new Error("This JPEG looks damaged.")
    segments.push({ marker, start: i, end })
    i = end
  }
  const dataStart = i
  // Inside image data, FF is always followed by 00 or a restart marker,
  // so the first FF D9 is the real end of the image.
  let imageEnd = b.length
  for (let j = dataStart; j + 1 < b.length; j++) {
    if (b[j] === 0xff && b[j + 1] === 0xd9) { imageEnd = j + 2; break }
  }
  return { segments, dataStart, imageEnd }
}

function keepJpegSegment(b: Uint8Array, s: Segment): boolean {
  const m = s.marker
  if (m === 0xe0) return startsWith(b, s.start + 4, "JFIF\0") // basic header (not thumbnails)
  if (m === 0xe2) return startsWith(b, s.start + 4, "ICC_PROFILE\0") // colour profile
  if (m === 0xee) return true // Adobe colour flag, needed to decode some JPEGs
  if (m >= 0xe1 && m <= 0xef) return false // EXIF, XMP, IPTC and other app data
  if (m === 0xfe) return false // comments
  return true // tables and frame headers the image needs
}

const EXIF_TAGS: Record<number, string> = {
  0x010f: "Device make",
  0x0110: "Device model",
  0x0131: "Software",
  0x0132: "Date modified",
  0x013b: "Author",
  0x8298: "Copyright",
  0x9003: "Date taken",
  0xa430: "Camera owner",
  0xa431: "Camera serial number",
  0xa434: "Lens model",
}
const TYPE_SIZES: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }

interface IfdEntry {
  type: number
  count: number
  valueAt: number
}

function parseExif(t: Uint8Array): { findings: Finding[]; orientation: number } {
  const findings: Finding[] = []
  let orientation = 1
  try {
    const v = view(t)
    const le = t[0] === 0x49 // "II" = little-endian
    const u16 = (o: number) => v.getUint16(o, le)
    const u32 = (o: number) => v.getUint32(o, le)

    const readIfd = (offset: number) => {
      const entries = new Map<number, IfdEntry>()
      const n = u16(offset)
      for (let k = 0; k < n; k++) {
        const e = offset + 2 + k * 12
        const type = u16(e + 2)
        const count = u32(e + 4)
        const size = (TYPE_SIZES[type] ?? 1) * count
        entries.set(u16(e), { type, count, valueAt: size <= 4 ? e + 8 : u32(e + 8) })
      }
      return entries
    }
    const collect = (ifd: Map<number, IfdEntry>) => {
      for (const [tag, x] of ifd) {
        const label = EXIF_TAGS[tag]
        if (!label || x.type !== 2) continue
        const value = display(utf8.decode(t.subarray(x.valueAt, x.valueAt + x.count)))
        if (value) findings.push({ label, value })
      }
    }

    const ifd0 = readIfd(u32(4))
    collect(ifd0)
    const o = ifd0.get(0x0112)
    if (o && o.type === 3) orientation = u16(o.valueAt)
    const exifIfd = ifd0.get(0x8769)
    if (exifIfd) collect(readIfd(u32(exifIfd.valueAt)))

    const gpsIfd = ifd0.get(0x8825)
    if (gpsIfd) {
      const gps = readIfd(u32(gpsIfd.valueAt))
      const coord = (tag: number, refTag: number) => {
        const x = gps.get(tag)
        if (!x || x.type !== 5 || x.count < 3) return null
        const rational = (k: number) => {
          const den = u32(x.valueAt + k * 8 + 4)
          return den ? u32(x.valueAt + k * 8) / den : 0
        }
        let value = rational(0) + rational(1) / 60 + rational(2) / 3600
        const ref = gps.get(refTag)
        const dir = ref ? latin1.decode(t.subarray(ref.valueAt, ref.valueAt + 1)) : ""
        if (dir === "S" || dir === "W") value = -value
        return value
      }
      if (gps.size > 0) {
        const lat = coord(2, 1)
        const lon = coord(4, 3)
        findings.unshift({
          label: "GPS location",
          value: lat !== null && lon !== null ? `${lat.toFixed(5)}, ${lon.toFixed(5)}` : "Present",
        })
      }
    }
  } catch {
    // Damaged EXIF: keep whatever was read. The whole block is removed either way.
  }
  return { findings, orientation }
}

function scanJpeg(b: Uint8Array): { findings: Finding[]; orientation: number } {
  const findings: Finding[] = []
  let orientation = 1
  const { segments, imageEnd } = jpegLayout(b)
  for (const s of segments) {
    const payload = s.start + 4
    if (s.marker === 0xe1 && startsWith(b, payload, "Exif\0\0")) {
      const exif = parseExif(b.subarray(payload + 6, s.end))
      findings.push(...(exif.findings.length ? exif.findings : [{ label: "EXIF data", value: "Camera settings and technical details" }]))
      orientation = exif.orientation
    } else if (s.marker === 0xe1 && startsWith(b, payload, "http://ns.adobe.com/xap/1.0/")) {
      findings.push({ label: "XMP metadata", value: "Editing history, software and author fields" })
    } else if (s.marker === 0xed) {
      findings.push({ label: "IPTC / Photoshop data", value: "Captions, author, copyright, keywords" })
    } else if (s.marker === 0xfe) {
      findings.push({ label: "Comment", value: display(utf8.decode(b.subarray(payload, s.end))) })
    } else if (!keepJpegSegment(b, s)) {
      findings.push({ label: "Other embedded data", value: `APP${s.marker - 0xe0} segment` })
    }
  }
  if (b.length - imageEnd > 16) {
    findings.push({ label: "Extra data after the image", value: "For example an embedded motion-photo video" })
  }
  return { findings: dedupe(findings), orientation }
}

async function cleanJpeg(file: Blob): Promise<CleanResult> {
  const b = await readImage(file)
  const { orientation } = scanJpeg(b)

  if (orientation !== 1) {
    // The photo is stored sideways and relies on the EXIF flag to display upright.
    // Removing EXIF would turn it sideways, so redraw it upright instead.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
    const canvas = document.createElement("canvas")
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Your browser couldn't process this photo.")
    ctx.drawImage(bitmap, 0, 0)
    bitmap.close()
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((x) => (x ? resolve(x) : reject(new Error("Couldn't save the photo."))), "image/jpeg", 0.95)
    )
    return { blob, method: "redrawn" }
  }

  const { segments, dataStart, imageEnd } = jpegLayout(b)
  const parts: BlobPart[] = [
    b.subarray(0, 2),
    ...segments.filter((s) => keepJpegSegment(b, s)).map((s) => b.subarray(s.start, s.end)),
    b.subarray(dataStart, imageEnd),
  ]
  return { blob: new Blob(parts, { type: "image/jpeg" }), method: "lossless" }
}

// ---------------------------------------------------------------------------
// PNG
// ---------------------------------------------------------------------------

const PNG_REMOVE = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"])

function processPng(b: Uint8Array): { findings: Finding[]; parts: BlobPart[] } {
  const findings: Finding[] = []
  const parts: BlobPart[] = [b.subarray(0, 8)]
  const v = view(b)
  let i = 8
  while (i + 12 <= b.length) {
    const len = v.getUint32(i)
    const type = fourcc(b, i + 4)
    const end = i + 12 + len
    if (end > b.length) throw new Error("This PNG looks damaged.")
    if (PNG_REMOVE.has(type)) {
      const data = b.subarray(i + 8, i + 8 + len)
      if (type === "eXIf") findings.push({ label: "EXIF data", value: "Camera, dates and possibly GPS" })
      else if (type === "tIME") findings.push({ label: "Last modified time" })
      else {
        const nul = data.indexOf(0)
        const key = latin1.decode(data.subarray(0, nul < 0 ? data.length : nul))
        if (key.toLowerCase().includes("xmp")) findings.push({ label: "XMP metadata", value: "Editing history, software and author fields" })
        else findings.push({
          label: `Text field: ${key || "unnamed"}`,
          value: type === "tEXt" && nul >= 0 ? display(latin1.decode(data.subarray(nul + 1))) : undefined,
        })
      }
    } else {
      parts.push(b.subarray(i, end))
    }
    i = end
    if (type === "IEND") break
  }
  if (b.length - i > 16) findings.push({ label: "Extra data after the image" })
  return { findings: dedupe(findings), parts }
}

// ---------------------------------------------------------------------------
// MP4 /
