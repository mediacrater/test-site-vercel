//app/layout.tsx
import React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, Atkinson_Hyperlegible_Next, Atkinson_Hyperlegible_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { GoogleTag } from "@/components/google-tag"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Display: Archivo with its width axis, used expanded and heavy for headlines.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

// Body and UI: Atkinson Hyperlegible Next, designed by the Braille Institute
// so letters stay distinct for readers with low vision.
const hyper = Atkinson_Hyperlegible_Next({
  subsets: ["latin"],
  variable: "--font-hyper",
  display: "swap",
  // Next has no fallback metrics for this family yet; skip the adjustment instead of logging an error.
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
})

// Timecodes and other tabular data only.
const hyperMono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-hyper-mono",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1424" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://mediacrater.com"),

  title: "Video Ad Policy Checker for Meta & TikTok | Mediacrater",
  description:
    "Scan video and image ads for likely Meta, TikTok, YouTube, Pinterest and X policy issues before you upload. Get timestamped findings and suggested fixes.",
  applicationName: "Mediacrater",
  authors: [{ name: "Mediacrater" }],
  creator: "Mediacrater",
  publisher: "Mediacrater",

  openGraph: {
    title: "Video Ad Policy Checker: Scan Before You Upload | Mediacrater",
    description: "Scan video ads for policy issues before uploading. Get timestamped findings and suggested fixes.",
    type: "website",
    locale: "en_US",
    siteName: "Mediacrater",
    url: "https://mediacrater.com",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mediacrater: scan video ads for policy issues before uploading",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mediacrater: Video Ad Policy Checker",
    description: "Scan video ads for policy issues before uploading. Get timestamped findings and suggested fixes.",
    images: ["/images/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  // Small copies of the logo (the originals are over 500 KB each).
  icons: {
    icon: [
      { url: "/images/logo-mark-192.png", type: "image/png", sizes: "192x192" },
      { url: "/images/logo-mark-dark-192.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: "/images/logo-mark-180-solid.png", sizes: "180x180" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${hyper.variable} ${hyperMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
        <GoogleTag />
      </body>
    </html>
  )
}
