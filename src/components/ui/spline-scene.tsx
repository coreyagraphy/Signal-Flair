'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-orange animate-pulse" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}

// Usage: Replace ORB01 canvas with Spline scene when 3D model is ready
// <SplineScene scene="https://prod.spline.design/YOUR_SCENE/scene.splinecode" className="w-full h-full" />
