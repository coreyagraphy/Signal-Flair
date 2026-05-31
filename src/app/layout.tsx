import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://mentalvision.ai'),
  title: 'Mental Vision Corp — AI Visibility + Cinematic Creative',
  description: 'We find every business the algorithm can\'t see, then build the signal that makes it impossible to ignore.',
  keywords: ['AI visibility', 'AEO', 'llms.txt', 'AI search', 'Indianapolis', 'cinematic creative'],
  openGraph: {
    title: 'Mental Vision Corp — Signal Flare',
    description: 'Discovery Is the First Connection.',
    images: ['/video/hero-poster.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF6E8' },
    { media: '(prefers-color-scheme: dark)',  color: '#0A0806' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
