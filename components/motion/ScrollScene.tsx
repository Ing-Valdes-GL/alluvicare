'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'

type Range = [number, number] | [number, number, number]

interface ScrollSceneProps {
  children: ReactNode
  className?: string
  /** valeurs [début, (milieu), fin] pendant que l'élément traverse l'écran */
  y?: Range
  rotateX?: Range
  rotateY?: Range
  rotateZ?: Range
  scale?: Range
  opacity?: Range
  perspective?: number
}

const steps = (r: Range) => (r.length === 3 ? [0, 0.5, 1] : [0, 1])

function useRangeTransform(progress: MotionValue<number>, range: Range | undefined, fallback: number) {
  return useTransform(progress, range ? steps(range) : [0, 1], range ?? [fallback, fallback])
}

/**
 * Transformations 3D pilotées par le scroll (style pages produit Apple) :
 * l'objet pivote / zoome / glisse pendant qu'il traverse le viewport.
 */
export function ScrollScene({
  children, className, y, rotateX, rotateY, rotateZ, scale, opacity, perspective = 1200,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  const style = {
    y: useRangeTransform(progress, y, 0),
    rotateX: useRangeTransform(progress, rotateX, 0),
    rotateY: useRangeTransform(progress, rotateY, 0),
    rotateZ: useRangeTransform(progress, rotateZ, 0),
    scale: useRangeTransform(progress, scale, 1),
    opacity: useRangeTransform(progress, opacity, 1),
    transformPerspective: perspective,
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : style} className="h-full w-full [transform-style:preserve-3d]">
        {children}
      </motion.div>
    </div>
  )
}

/** Flottement continu (lévitation douce) pour les visuels produit. */
export function Float({ children, className, amplitude = 12, duration = 6 }: { children: ReactNode; className?: string; amplitude?: number; duration?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -amplitude, 0], rotateZ: [0, 1.2, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
