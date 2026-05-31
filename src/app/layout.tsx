import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://mentalvision.ai'),
  title: 'Signal Flare by Mental Vision Corp — AI Visibility + Cinematic Creative',
  description: 'Signal Flare finds the businesses AI cannot see, then builds the proof that makes them impossible to miss.',
  keywords: ['AI visibility', 'AEO', 'llms.txt', 'AI search', 'Indianapolis', 'cinematic creative'],
  openGraph: {
    title: 'Signal Flare — Mental Vision Corp',
    description: 'Discovery is the first connection. Signal Flare makes your business visible to AI and unforgettable to customers.',
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
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.011" numOctaves={2} seed={7} result="noise" />
            <feGaussianBlur in="noise" stdDeviation="1.2" result="soft" />
            <feDisplacementMap in="SourceGraphic" in2="soft" scale={30} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  )
}
