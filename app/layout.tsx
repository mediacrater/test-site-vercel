import React from "react"
import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: 'Mediacrater - AI Video Ad Policy Compliance Checker',
  description: 'Stop getting banned. Scan video ads for Meta & TikTok policy violations before you upload. Get instant AI confidence scores and actionable fixes.',
  keywords: [
    // The Solution (Pro Terms)
    'ad policy checker', 'video ad compliance', 'AI ad creative audit', 'ad scanner extension',
    // The Symptom (Panic Terms)
    'Facebook ad rejected', 'TikTok ad account ban', 'Meta ad violation', 'Google ads disapproved',
    // The Specific Pain
    'circumventing systems policy', 'unacceptable business practices', 'low quality ad score'
  ],
  authors: [{ name: 'Mediacrater' }],
  creator: 'Mediacrater',
  openGraph: {
    title: 'Mediacrater - AI Video Ad Policy Compliance Checker',
    description: 'Scan video ads for policy violations before uploading. Get AI confidence scores and actionable fixes instantly.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Mediacrater',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mediacrater - AI Video Ad Policy Compliance Checker',
    description: 'Scan video ads for policy violations before uploading. Get AI confidence scores and actionable fixes instantly.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/images/header-logo.png', // Main favicon
        href: '/images/header-logo.png',
      },
      {
        url: '/images/header-logo-dark.png', // Favicon for dark mode/OS
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [
      {
        url: '/images/header-logo.png', // For iPhone home screens
      },
    ],
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
