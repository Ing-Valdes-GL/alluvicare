'use client'

import type { ReactNode } from 'react'
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import { EASE_OUT } from './tokens'

/** Respecte `prefers-reduced-motion` partout + barre de progression de lecture. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.8, ease: EASE_OUT }}>
      <ScrollProgress />
      {children}
    </MotionConfig>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[400] h-[2px] origin-left bg-gradient-to-r from-[#EF6C00] via-[#FFA52F] to-[#FFD363]"
      style={{ scaleX }}
    />
  )
}
