'use client'

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

/**
 * LiquidGlass — hand-rolled Apple-style "liquid glass" surface.
 *
 * No dependency (liquid-glass-react requires React 19; this app is React 18).
 * Degrades in three tiers, handled entirely in globals.css:
 *   • Chromium      → backdrop blur + SVG feDisplacementMap edge refraction
 *   • Safari / FF   → frosted backdrop blur (url() filter is dropped, blur stays)
 *   • no backdrop-filter → solid translucent fill
 *
 * Renders the layer stack (refraction / tint / specular shine) behind a
 * z-indexed content slot. Pass the visible label/markup as children.
 */
type LiquidGlassProps<T extends ElementType> = {
  as?: T
  tint?: 'neutral' | 'orange'
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export default function LiquidGlass<T extends ElementType = 'div'>({
  as,
  tint = 'neutral',
  className = '',
  children,
  ...rest
}: LiquidGlassProps<T>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag className={`lg ${tint === 'orange' ? 'lg--orange' : ''} ${className}`} {...rest}>
      <span className="lg__refraction" aria-hidden="true" />
      <span className="lg__tint" aria-hidden="true" />
      <span className="lg__shine" aria-hidden="true" />
      <span className="lg__content">{children}</span>
    </Tag>
  )
}
