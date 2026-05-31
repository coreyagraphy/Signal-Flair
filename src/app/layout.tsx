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
      <body>
        {/* Liquid-glass displacement filter — referenced by .lg__refraction.
            Chromium-only effect; harmless/inert elsewhere. */}
        <svg
          aria-hidden="true"
          width="0"
          height="0"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        >
          <filter
            id="lg-distortion"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.013 0.013" numOctaves={2} seed={7} result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.1" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale={22} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  )
}
