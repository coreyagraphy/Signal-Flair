import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://signalflair.ai'),
  title: 'Signal Flair — Your business, found by AI.',
  description: 'Signal Flair scores your AI visibility across ChatGPT, Perplexity, Claude, Gemini, and Google AI — then builds the llms.txt, schema, and crawler access generative engines need to find and recommend you.',
  keywords: ['AI visibility', 'AEO', 'agentic engine optimization', 'llms.txt', 'schema markup', 'AI search', 'Indianapolis'],
  openGraph: {
    title: 'Signal Flair — Your business, found by AI.',
    description: 'Discovery is the first connection. We make your business visible to the AI engines deciding who gets recommended.',
    images: ['/video/hero-poster.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0806',
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
