//app/tools/video-metadata-remover/page.tsx
import type { Metadata } from "next"
import { getTool } from "@/lib/tools/registry"
import { ToolPageShell } from "@/components/tools/tool-page-shell"
import { MetadataCleaner } from "./tool"

const tool = getTool("video-metadata-remover")

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: { canonical: `/tools/${tool.slug}` },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: `/tools/${tool.slug}`,
    type: "website",
  },
}

export default function Page() {
  return (
    <ToolPageShell
      tool={tool}
      intro="See what your video or photo reveals (GPS location, device, editing software, dates), then download a clean copy. Works with MP4, MOV, JPG and PNG, entirely on your device."
      method={
        <>
          <p>
            Phones record the location, device model and date in every video and photo. Editing apps add their own
            name, and Adobe apps can add a full editing history. When you send a raw file to a client, hire a UGC
            creator, or share a creative outside your team, all of that travels with it, including GPS coordinates
            that can point to someone's home.
          </p>
          <p>
            <strong>Videos:</strong> the tool blanks out the metadata sections inside the file and zeroes the
            recording dates. The video and audio aren't re-encoded or even read, so quality is identical and large
            files work fine.
          </p>
          <p>
            <strong>Photos:</strong> EXIF, XMP, IPTC and comment data are removed without touching the image itself.
            Photos that rely on a rotation flag are redrawn upright so they don't turn sideways.
          </p>
          <p>
            After cleaning, the tool scans the new file again so you can see exactly what's left.
          </p>
          <p>
            <strong>What this doesn't do:</strong> removing metadata doesn't change how Meta, TikTok or Google review
            your ad, and it doesn't hide an ad or account from their enforcement. Platforms review ads by what's in
            them, not by file tags. Use this for privacy.
          </p>
        </>
      }
      limits={[
        "Some encoders also write their name inside the video stream itself. Removing that requires re-encoding, which this tool doesn't do.",
        "Timed metadata tracks (used by some cameras and drones for GPS paths) are detected but not removed.",
        "Supports JPG, PNG, MP4 and MOV. HEIC, WebP and other formats aren't supported yet.",
        "Photos up to 50 MB. Videos can be much larger, because only the file's header is processed.",
      ]}
      faqs={[
        {
          q: "Does removing metadata reduce quality?",
          a: "No for videos and for most photos: the picture and sound data aren't changed. The only exception is a photo that relies on a rotation flag. It's redrawn upright and re-saved at high quality, and the tool tells you when this happens.",
        },
        {
          q: "Don't Facebook and Instagram remove metadata anyway?",
          a: "Independent tests show Meta strips location data from the public copy of uploaded photos, but it receives your original file first. Cleaning the file yourself is the only way to control what leaves your device, including files you send to clients or creators.",
        },
        {
          q: "Will this stop my ads from being rejected or linked to other accounts?",
          a: "No. Ad review looks at what your ad shows and says, and platforms match content by what's in it, not by file metadata. This tool is for privacy, not for getting around platform rules.",
        },
        {
          q: "Is my file uploaded anywhere?",
          a: "No. Everything happens in your browser. You can check: load this page, turn off your internet connection, and the tool still works.",
        },
        {
          q: "How can I double-check the result?",
          a: "The tool re-scans the cleaned file automatically. For a second opinion, run the free command-line tool ExifTool on the downloaded file.",
        },
      ]}
    >
      <MetadataCleaner />
    </ToolPageShell>
  )
}
