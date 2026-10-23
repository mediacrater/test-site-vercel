//lib/mediacrater/metadataStrip.ts
//
// Removes embedded metadata (GPS, device, author, software, dates, XMP...)
// from images and videos in the browser, before anything is uploaded.
//
// Lossless: pixels and video frames are never re-encoded. Only metadata
// blocks are dropped (images) or blanked in place (MP4/MOV, so every offset
// in the file stays valid). The one exception is a JPEG with an EXIF
// rotation: it's redrawn upright at high quality, otherwise it would reach
// the AI sideways once the rotation tag is gone.
//
// The server checks the result itself (VPS utils/metadataInspector.js) and
// logs the verdict; this file's report is only used to say what was removed.

export interface MetadataReport {
  stripped: boolean;
  removed: string[];
}

export interface StripResult {
  blob: Blob;
  report: MetadataReport;
}

export type VideoStripResult =
  | (StripResult & { fallback: null })
  | { fallback: 'unsupported' | 'unreadable'; blob: null; report: MetadataReport };

const NOTHING_REMOVED: MetadataReport = { stripped: true, removed: [] };

// Pieces of a rebuilt file: untouched slices of the original, or patched bytes.
// (Recent TypeScript typings reject Uint8Array<ArrayBufferLike> as a BlobPart,
// even though every browser accepts it; the cast is limited to this helper.)
type Part = Blob | Uint8Array;

function toBlob(parts: Part[], type: string): Blob {
  return new Blob(parts as unknown as BlobPart[], { type });
}

// ── Small helpers ──────────────────────────────────────────────────────────

function ascii(bytes: Uint8Array, start: number, length: number): string {
  if (start < 0 || start + length > bytes.length) return '';
  let out = '';
  for (let i = start; i < start + length; i++) out += String.fromCharCode(bytes[i]);
  return out;
}

function u16be(bytes: Uint8Array, offset: number): number {
  return (bytes[offset] << 8) | bytes[offset + 1];
}

function u32be(bytes: Uint8Array, offset: number): number {
  return ((bytes[offset] << 24) >>> 0) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
}

function u32le(bytes: Uint8Array, offset: number): number {
  return bytes[offset] + (bytes[offset + 1] << 8) + (bytes[offset + 2] << 16) + ((bytes[offset + 3] << 24) >>> 0);
}

function u64be(bytes: Uint8Array, offset: number): number {
  const high = u32be(bytes, offset);
  const low = u32be(bytes, offset + 4);
  return high * 2 ** 32 + low;
}

function writeU32le(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

class Removed {
  private names = new Set<string>();
  add(name: string) {
    this.names.add(name);
  }
  get list(): string[] {
    return [...this.names];
  }
  get size(): number {
    return this.names.size;
  }
}

// ── JPEG ───────────────────────────────────────────────────────────────────

// Reads the EXIF orientation (1-8) from an APP1 Exif payload, or null.
function readExifOrientation(segment: Uint8Array): number | null {
  if (ascii(segment, 0, 6) !== 'Exif\0\0') return null;
  const tiff = segment.subarray(6);
  if (tiff.length < 8) return null;
  const little = ascii(tiff, 0, 2) === 'II';
  const r16 = (o: number) => (o + 2 > tiff.length ? 0 : little ? tiff[o] | (tiff[o + 1] << 8) : u16be(tiff, o));
  const r32 = (o: number) => (o + 4 > tiff.length ? 0 : little ? u32le(tiff, o) : u32be(tiff, o));
  const ifd = r32(4);
  if (!ifd || ifd + 2 > tiff.length) return null;
  const count = Math.min(r16(ifd), 512);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > tiff.length) break;
    if (r16(entry) === 0x0112) return r16(entry + 8);
  }
  return null;
}

function stripJpeg(bytes: Uint8Array, removed: Removed): { parts: Part[]; orientation: number | null } | null {
  const parts: Part[] = [bytes.subarray(0, 2)];
  let orientation: number | null = null;
  let offset = 2;

  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];

    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      parts.push(bytes.subarray(offset, offset + 2));
      offset += 2;
      continue;
    }
    if (marker === 0xda) {
      // Start of image data: everything from here on is kept as-is.
      parts.push(bytes.subarray(offset));
      return { parts, orientation };
    }
    if (marker === 0xd9) return null;

    const length = u16be(bytes, offset + 2);
    if (length < 2 || offset + 2 + length > bytes.length) return null;
    const segment = bytes.subarray(offset + 4, offset + 2 + length);
    const whole = bytes.subarray(offset, offset + 2 + length);

    let keep = true;
    if (marker === 0xe1) {
      keep = false;
      const isExif = ascii(segment, 0, 6) === 'Exif\0\0';
      if (isExif) orientation = orientation ?? readExifOrientation(segment);
      removed.add(isExif ? 'EXIF' : ascii(segment, 0, 20).startsWith('http://ns.adobe.com/') ? 'XMP' : 'Other metadata');
    } else if (marker === 0xe2) {
      keep = ascii(segment, 0, 12) === 'ICC_PROFILE\0'; // colour profile stays
      if (!keep) removed.add('Other metadata');
    } else if (marker === 0xe0) {
      keep = ascii(segment, 0, 5) === 'JFIF\0';
      if (!keep) removed.add('Other metadata');
    } else if (marker === 0xee) {
      keep = true; // Adobe APP14: colour transform info needed to decode
    } else if (marker === 0xed) {
      keep = false;
      removed.add('IPTC');
    } else if (marker === 0xfe) {
      keep = false;
      removed.add('Comment');
    } else if (marker >= 0xe3 && marker <= 0xef) {
      keep = false;
      removed.add('Other metadata');
    }

    if (keep) parts.push(whole);
    offset += 2 + length;
  }

  return null;
}

// ── PNG ────────────────────────────────────────────────────────────────────

const PNG_DROP = new Map<string, string>([
  ['tEXt', 'Text'],
  ['zTXt', 'Text'],
  ['iTXt', 'Text'],
  ['eXIf', 'EXIF'],
  ['tIME', 'Date'],
]);

function stripPng(bytes: Uint8Array, removed: Removed): Part[] | null {
  const parts: Part[] = [bytes.subarray(0, 8)];
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = u32be(bytes, offset);
    const type = ascii(bytes, offset + 4, 4);
    const end = offset + 12 + length;
    if (end > bytes.length) return null;
    const drop = PNG_DROP.get(type);
    if (drop) {
      // iTXt holding XMP is reported as XMP
      removed.add(type === 'iTXt' && ascii(bytes, offset + 8, 17) === 'XML:com.adobe.xmp' ? 'XMP' : drop);
    } else {
      parts.push(bytes.subarray(offset, end));
    }
    offset = end;
    if (type === 'IEND') return parts;
  }
  return null;
}

// ── WebP ───────────────────────────────────────────────────────────────────

function stripWebp(bytes: Uint8Array, removed: Removed): Part[] | null {
  const chunks: Uint8Array[] = [];
  let offset = 12;
  let total = 4; // "WEBP"
  while (offset + 8 <= bytes.length) {
    const type = ascii(bytes, offset, 4);
    const size = u32le(bytes, offset + 4);
    const end = offset + 8 + size + (size % 2);
    if (offset + 8 + size > bytes.length) return null;
    const chunk = bytes.subarray(offset, Math.min(end, bytes.length));

    if (type === 'EXIF' || type === 'XMP ') {
      removed.add(type === 'EXIF' ? 'EXIF' : 'XMP');
    } else if (type === 'VP8X') {
      const copy = chunk.slice();
      copy[8] &= ~(0x08 | 0x04); // clear "has EXIF" and "has XMP" flags
      chunks.push(copy);
      total += copy.length;
    } else {
      chunks.push(chunk);
      total += chunk.length;
    }
    offset = end;
  }

  if (removed.size === 0) return null; // nothing to do; caller keeps the original
  const header = bytes.slice(0, 12);
  writeU32le(header, 4, total);
  return [header, ...chunks];
}

// ── GIF ────────────────────────────────────────────────────────────────────

const GIF_KEEP_APPS = new Set(['NETSCAPE2.0', 'ANIMEXTS1.0', 'ICCRGBG1012']);

function skipSubBlocks(bytes: Uint8Array, offset: number): number {
  while (offset < bytes.length) {
    const size = bytes[offset];
    offset += 1;
    if (size === 0) return offset;
    offset += size;
  }
  return -1;
}

function stripGif(bytes: Uint8Array, removed: Removed): Part[] | null {
  if (bytes.length < 13) return null;
  let offset = 13;
  const packed = bytes[10];
  if (packed & 0x80) offset += 3 * (1 << ((packed & 0x07) + 1));
  const parts: Part[] = [bytes.subarray(0, offset)];

  while (offset < bytes.length) {
    const block = bytes[offset];
    if (block === 0x3b) {
      parts.push(bytes.subarray(offset, offset + 1));
      return parts;
    }
    if (block === 0x2c) {
      if (offset + 10 > bytes.length) return null;
      const local = bytes[offset + 9];
      let end = offset + 10;
      if (local & 0x80) end += 3 * (1 << ((local & 0x07) + 1));
      end = skipSubBlocks(bytes, end + 1);
      if (end < 0) return null;
      parts.push(bytes.subarray(offset, end));
      offset = end;
    } else if (block === 0x21) {
      const label = bytes[offset + 1];
      const end = skipSubBlocks(bytes, offset + 2);
      if (end < 0) return null;
      let keep = true;
      if (label === 0xfe) {
        keep = false;
        removed.add('Comment');
      } else if (label === 0xff) {
        const appId = ascii(bytes, offset + 3, 11);
        if (!GIF_KEEP_APPS.has(appId)) {
          keep = false;
          removed.add(appId === 'XMP DataXMP' ? 'XMP' : 'Other metadata');
        }
      }
      if (keep) parts.push(bytes.subarray(offset, end));
      offset = end;
    } else {
      return null;
    }
  }
  return null;
}

// ── Images: entry point ────────────────────────────────────────────────────

// Redraws an image upright (applying its EXIF rotation) with no metadata.
async function reencodeUpright(file: Blob, type: string, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.drawImage(bitmap, 0, 0);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Image encode failed'))), type, quality)
    );
  } finally {
    bitmap.close();
  }
}

/**
 * Returns the image without metadata. If the file's structure can't be read,
 * it's redrawn on a canvas instead (which never carries metadata).
 */
export async function stripImageMetadata(file: File): Promise<StripResult> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const removed = new Removed();
  let parts: Part[] | null = null;
  let type = file.type;

  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    type = 'image/jpeg';
    const result = stripJpeg(bytes, removed);
    if (result && result.orientation !== null && result.orientation >= 2 && result.orientation <= 8) {
      const blob = await reencodeUpright(file, 'image/jpeg', 0.95);
      removed.add('Rotated');
      return { blob, report: { stripped: true, removed: removed.list } };
    }
    parts = result ? result.parts : null;
  } else if (u32be(bytes, 0) === 0x89504e47 && u32be(bytes, 4) === 0x0d0a1a0a) {
    type = 'image/png';
    parts = stripPng(bytes, removed);
  } else if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
    type = 'image/webp';
    parts = stripWebp(bytes, removed);
    if (!parts && removed.size === 0) return { blob: file, report: NOTHING_REMOVED };
  } else if (ascii(bytes, 0, 4) === 'GIF8') {
    type = 'image/gif';
    parts = stripGif(bytes, removed);
  }

  if (!parts) {
    // Unknown or damaged structure: a canvas redraw is the only safe option.
    const reencodeType = type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    const blob = await reencodeUpright(file, reencodeType, 0.95);
    return { blob, report: { stripped: true, removed: ['Other metadata'] } };
  }

  if (removed.size === 0) return { blob: file, report: NOTHING_REMOVED };
  return { blob: toBlob(parts, type), report: { stripped: true, removed: removed.list } };
}

// ── MP4 / MOV ──────────────────────────────────────────────────────────────

const MAX_MOOV_BYTES = 32 * 1024 * 1024;
const MAX_BLANK_BYTES = 16 * 1024 * 1024; // top-level metadata + data-track samples
const MAX_TOP_LEVEL_BOXES = 64;
const ALLOWED_HANDLERS = new Set(['vide', 'soun', 'tmcd']);
const XMP_UUID = [0xbe, 0x7a, 0xcf, 0xcb, 0x97, 0xa9, 0x42, 0xe8, 0x9c, 0x71, 0x99, 0x94, 0x91, 0xe3, 0xaf, 0xac];
const FREE = [0x66, 0x72, 0x65, 0x65]; // "free"

interface Box {
  type: string;
  start: number;
  headerSize: number;
  end: number;
}

class VideoStripError extends Error {}

function readBox(bytes: Uint8Array, offset: number, end: number): Box | null {
  if (offset + 8 > end) return null;
  let size = u32be(bytes, offset);
  const type = ascii(bytes, offset + 4, 4);
  let headerSize = 8;
  if (size === 1) {
    if (offset + 16 > end) return null;
    size = u64be(bytes, offset + 8);
    headerSize = 16;
  } else if (size === 0) {
    size = end - offset;
  }
  if (size < headerSize || offset + size > end) return null;
  return { type, start: offset, headerSize, end: offset + size };
}

// Turns a box into an empty "free" box of the same size: same length, so no
// offset anywhere in the file changes, and players skip it.
function blankBox(bytes: Uint8Array, box: Box) {
  bytes.set(FREE, box.start + 4);
  bytes.fill(0, box.start + box.headerSize, box.end);
}

function zeroTimes(bytes: Uint8Array, box: Box): boolean {
  const payload = box.start + box.headerSize;
  if (payload + 4 > box.end) return false;
  const version = bytes[payload];
  const length = version === 1 ? 16 : 8;
  if (payload + 4 + length > box.end) return false;
  const times = bytes.subarray(payload + 4, payload + 4 + length);
  const nonZero = times.some((b) => b !== 0);
  times.fill(0);
  return nonZero;
}

// Byte ranges (absolute file offsets) of every sample in a track, from its
// sample tables. Used to blank a data track's samples inside mdat.
function trackSampleRanges(bytes: Uint8Array, trak: Box): Array<[number, number]> {
  const find = (parent: Box, type: string): Box | null => {
    let offset = parent.start + parent.headerSize;
    while (offset < parent.end) {
      const child = readBox(bytes, offset, parent.end);
      if (!child) return null;
      if (child.type === type) return child;
      offset = child.end;
    }
    return null;
  };
  const mdia = find(trak, 'mdia');
  const minf = mdia && find(mdia, 'minf');
  const stbl = minf && find(minf, 'stbl');
  if (!stbl) throw new VideoStripError('no sample table');

  const stsz = find(stbl, 'stsz');
  const stsc = find(stbl, 'stsc');
  const stco = find(stbl, 'stco');
  const co64 = find(stbl, 'co64');
  if (!stsz || !stsc || (!stco && !co64)) throw new VideoStripError('incomplete sample table');

  // stsz: uniform size, or one size per sample
  const szPayload = stsz.start + stsz.headerSize;
  const uniformSize = u32be(bytes, szPayload + 4);
  const sampleCount = u32be(bytes, szPayload + 8);
  if (sampleCount > 200_000) throw new VideoStripError('too many samples');
  const sizeOf = (i: number) => (uniformSize !== 0 ? uniformSize : u32be(bytes, szPayload + 12 + i * 4));

  // chunk offsets
  const coBox = (co64 || stco) as Box;
  const coPayload = coBox.start + coBox.headerSize;
  const chunkCount = u32be(bytes, coPayload + 4);
  const chunkOffset = (i: number) =>
    co64 ? u64be(bytes, coPayload + 8 + i * 8) : u32be(bytes, coPayload + 8 + i * 4);

  // stsc runs: (first_chunk, samples_per_chunk)
  const scPayload = stsc.start + stsc.headerSize;
  const runCount = u32be(bytes, scPayload + 4);
  const ranges: Array<[number, number]> = [];
  let sample = 0;
  for (let run = 0; run < runCount && sample < sampleCount; run++) {
    const entry = scPayload + 8 + run * 12;
    const firstChunk = u32be(bytes, entry) - 1;
    const perChunk = u32be(bytes, entry + 4);
    const nextFirst = run + 1 < runCount ? u32be(bytes, entry + 12) - 1 : chunkCount;
    for (let chunk = firstChunk; chunk < nextFirst && chunk < chunkCount && sample < sampleCount; chunk++) {
      let position = chunkOffset(chunk);
      for (let k = 0; k < perChunk && sample < sampleCount; k++) {
        const size = sizeOf(sample);
        if (size > 0) ranges.push([position, size]);
        position += size;
        sample += 1;
      }
    }
  }
  return ranges;
}

function handlerOf(bytes: Uint8Array, trak: Box): string {
  let offset = trak.start + trak.headerSize;
  while (offset < trak.end) {
    const child = readBox(bytes, offset, trak.end);
    if (!child) return '';
    if (child.type === 'mdia') {
      let inner = child.start + child.headerSize;
      while (inner < child.end) {
        const box = readBox(bytes, inner, child.end);
        if (!box) return '';
        if (box.type === 'hdlr') return ascii(bytes, box.start + box.headerSize + 8, 4);
        inner = box.end;
      }
    }
    offset = child.end;
  }
  return '';
}

// Edits the moov copy in place. Returns sample ranges (absolute offsets) of
// detached data tracks, which the caller blanks inside mdat.
function cleanMoov(moov: Uint8Array, start: number, end: number, removed: Removed, depth: number): Array<[number, number]> {
  const blanks: Array<[number, number]> = [];
  let offset = start;
  while (offset < end && depth < 8) {
    const box = readBox(moov, offset, end);
    if (!box) throw new VideoStripError('bad box');

    switch (box.type) {
      case 'mvhd':
      case 'tkhd':
      case 'mdhd':
        if (zeroTimes(moov, box)) removed.add('Creation date');
        break;
      case 'trak': {
        const handler = handlerOf(moov, box);
        if (handler && !ALLOWED_HANDLERS.has(handler)) {
          // A data track (GPS telemetry, timed metadata, subtitles): its
          // samples are blanked in mdat and the track itself is detached.
          blanks.push(...trackSampleRanges(moov, box));
          blankBox(moov, box);
          removed.add('Data track');
        } else {
          blanks.push(...cleanMoov(moov, box.start + box.headerSize, box.end, removed, depth + 1));
        }
        break;
      }
      case 'mdia':
        blanks.push(...cleanMoov(moov, box.start + box.headerSize, box.end, removed, depth + 1));
        break;
      case 'udta':
        blankBox(moov, box);
        removed.add('User data');
        break;
      case 'meta':
        blankBox(moov, box);
        removed.add('Metadata');
        break;
      case 'free':
      case 'skip':
        moov.fill(0, box.start + box.headerSize, box.end);
        break;
      default:
        break;
    }
    offset = box.end;
  }
  return blanks;
}

async function readSlice(file: Blob, start: number, length: number): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(start, start + length).arrayBuffer());
}

/**
 * Returns the MP4/MOV with every metadata block blanked in place. Anything
 * this can't handle safely (WebM, damaged files, huge headers) comes back as
 * a fallback, and the caller uses the frame path instead.
 */
export async function stripVideoMetadata(file: File): Promise<VideoStripResult> {
  const fail = (fallback: 'unsupported' | 'unreadable'): VideoStripResult => ({
    fallback,
    blob: null,
    report: { stripped: false, removed: [] },
  });

  try {
    const first = await readSlice(file, 0, 16);
    if (!['ftyp', 'moov', 'mdat', 'wide', 'free', 'skip'].includes(ascii(first, 4, 4))) {
      return fail('unsupported');
    }

    const removed = new Removed();
    const patches: Array<{ offset: number; bytes: Uint8Array }> = [];
    const sampleBlanks: Array<[number, number]> = [];
    let blankBytes = 0;
    let offset = 0;
    let boxes = 0;
    let sawMoov = false;

    while (offset + 8 <= file.size && boxes < MAX_TOP_LEVEL_BOXES) {
      boxes += 1;
      const head = await readSlice(file, offset, Math.min(32, file.size - offset));
      let size = u32be(head, 0);
      let headerSize = 8;
      if (size === 1) {
        size = u64be(head, 8);
        headerSize = 16;
      } else if (size === 0) {
        size = file.size - offset;
      }
      if (size < headerSize || offset + size > file.size) return fail('unreadable');
      const type = ascii(head, 4, 4);

      if (type === 'moov') {
        if (size > MAX_MOOV_BYTES) return fail('unreadable');
        sawMoov = true;
        const moov = await readSlice(file, offset, size);
        const blanks = cleanMoov(moov, headerSize, moov.length, removed, 0);
        // Sample offsets are absolute; moov edits don't move them.
        sampleBlanks.push(...blanks);
        patches.push({ offset, bytes: moov });
      } else if (
        type === 'meta' ||
        type === 'udta' ||
        (type === 'uuid' && XMP_UUID.every((b, i) => head[headerSize + i] === b))
      ) {
        blankBytes += size;
        if (blankBytes > MAX_BLANK_BYTES) return fail('unreadable');
        const blank = new Uint8Array(size);
        blank.set(head.subarray(0, headerSize));
        blankBox(blank, { type, start: 0, headerSize, end: size });
        patches.push({ offset, bytes: blank });
        removed.add(type === 'uuid' ? 'XMP' : 'Metadata');
      }

      offset += size;
    }

    if (!sawMoov) return fail('unreadable');

    for (const [start, length] of sampleBlanks) {
      blankBytes += length;
      if (blankBytes > MAX_BLANK_BYTES || start + length > file.size) return fail('unreadable');
      patches.push({ offset: start, bytes: new Uint8Array(length) });
    }

    if (removed.size === 0) {
      return { fallback: null, blob: file, report: NOTHING_REMOVED };
    }

    // Stitch: untouched slices of the original file + patched regions. Nothing
    // is copied except the patches, so a 500 MB file costs no extra memory.
    patches.sort((a, b) => a.offset - b.offset);
    const parts: Part[] = [];
    let cursor = 0;
    for (const patch of patches) {
      if (patch.offset < cursor) return fail('unreadable'); // overlapping regions: refuse
      parts.push(file.slice(cursor, patch.offset));
      parts.push(patch.bytes);
      cursor = patch.offset + patch.bytes.length;
    }
    parts.push(file.slice(cursor));

    return {
      fallback: null,
      blob: toBlob(parts, file.type || 'video/mp4'),
      report: { stripped: true, removed: removed.list },
    };
  } catch (error) {
    if (!(error instanceof VideoStripError)) console.warn('[METADATA] Video strip failed:', error);
    return fail('unreadable');
  }
}
