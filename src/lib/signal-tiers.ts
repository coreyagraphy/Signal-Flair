// Single source of truth for the Signal Score tier system — used by the /scorecard page
// AND the /pulse on-page result so scoring colors, names, and verdicts stay uniform.
// Four tiers: red = invisible/bad at the bottom, green = strong at the top. The verdict
// gently roasts how visible the business is to AI engines.

export type Tier = { min: number; max: number; name: string; color: string; verdict: string }

export const TIERS: Tier[] = [
  { min: 0, max: 39, name: 'Ghost', color: '#ff3b47', verdict: 'Ask AI about your business and it politely invents someone else. You’re not in the room.' },
  { min: 40, max: 59, name: 'Faint Signal', color: '#ff7a1a', verdict: 'The machines catch a flicker, hesitate, then recommend your competitor. So close.' },
  { min: 60, max: 79, name: 'On the Radar', color: '#ffcf33', verdict: 'AI can find you and mostly gets it right — it just won’t vouch for you yet.' },
  { min: 80, max: 100, name: 'Signal Locked', color: '#2be69a', verdict: 'AI recommends you by name — for now. Visibility is a title you defend, not a trophy you keep. Ease off, and the machines move on.' },
]

export const tierFor = (s: number): Tier =>
  TIERS.find((t) => s >= t.min && s <= t.max) ?? TIERS[0]
