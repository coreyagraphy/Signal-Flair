'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function RevealWrapper({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36, rotateX: -12 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}
