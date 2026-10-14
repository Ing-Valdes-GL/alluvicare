'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { EASE_OUT, VIEWPORT_ONCE } from './tokens'

type RevealVariant = 'up' | 'fade' | 'scale' | 'tilt' | 'left' | 'right'

const hidden: Record<RevealVariant, Record<string, number>> = {
  up: { opacity: 0, y: 48 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.92, y: 24 },
  tilt: { opacity: 0, rotateX: 22, y: 70, scale: 0.96 }, // carte qui "se redresse" en 3D
  left: { opacity: 0, x: -56 },
  right: { opacity: 0, x: 56 },
}

export const revealVariants = (variant: RevealVariant = 'up', delay = 0): Variants => ({
  hidden: { ...hidden[variant] },
  show: {
    opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0,
    transition: { duration: variant === 'tilt' ? 1.1 : 0.9, ease: EASE_OUT, delay },
  },
})

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
  once?: boolean
}

/** Apparition au scroll, façon apple.com. */
export function Reveal({ children, variant = 'up', delay = 0, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={revealVariants(variant, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ ...VIEWPORT_ONCE, once }}
      style={variant === 'tilt' ? { transformPerspective: 1200, transformOrigin: '50% 100%' } : undefined}
    >
      {children}
    </motion.div>
  )
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** Conteneur : ses <StaggerItem> apparaissent en cascade (80 ms par défaut). */
export function Stagger({
  children, className, stagger = 0.08, delay = 0, as = 'div',
}: { children: ReactNode; className?: string; stagger?: number; delay?: number; as?: 'div' | 'ul' | 'tbody' }) {
  const Comp = as === 'ul' ? motion.ul : as === 'tbody' ? motion.tbody : motion.div
  return (
    <Comp className={className} variants={containerVariants(stagger, delay)} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>
      {children}
    </Comp>
  )
}

export function StaggerItem({
  children, className, variant = 'up', as = 'div',
}: { children: ReactNode; className?: string; variant?: RevealVariant; as?: 'div' | 'li' | 'article' }) {
  const Comp = as === 'li' ? motion.li : as === 'article' ? motion.article : motion.div
  return (
    <Comp
      className={className}
      variants={revealVariants(variant)}
      style={variant === 'tilt' ? { transformPerspective: 1200 } : undefined}
    >
      {children}
    </Comp>
  )
}
