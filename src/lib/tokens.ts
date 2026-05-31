// src/lib/tokens.ts
export const tokens = {
  colors: {
    yellow:   '#F7FF5A',   // Signal energy — primary accent
    orange:   '#FF7A45',   // CTA, hover states
    orange2:  '#E85D04',   // Deep orange, active states
    teal:     '#00A6A6',   // AEO service arm
    pink:     '#FF1177',   // Alerts, blocked indicators ONLY
    cream:    '#FFF6E8',   // Inner section backgrounds
    cream2:   '#F8EEDB',   // Secondary cream
    charcoal: '#171312',   // Dark section backgrounds
    charcoal2:'#2A2220',   // Cards on dark
    white:    '#FFFFFF',
    nearBlack:'#0A0806',   // Hero/intro atmosphere — NOT pure black
  },
  fonts: {
    display: "'Bebas Neue', sans-serif",
    serif:   "'DM Serif Display', serif",
    mono:    "'DM Mono', monospace",
    body:    "'Barlow Condensed', sans-serif",
  },
  // Cloud world (hero background)
  cloudWorld: {
    left:         '#D7E1EA',  // Blue-gray
    right:        '#F6D6E0',  // Blush pink
    bottomRight:  '#FFD4A0',  // Warm peach amber
    robotEye:     '#FF6B35',  // ORB-01 optical lens
  },
} as const
