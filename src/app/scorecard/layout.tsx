import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signal Scorecard™ · Signal Flair',
  description: 'Your Signal Score™ — a single defensible number across seven layers of AI readiness.',
  robots: { index: false, follow: false },
}

export default function ScorecardLayout({ children }: { children: React.ReactNode }) {
  return children
}
