'use client'

import { useRef, type ReactNode, type PointerEvent, type CSSProperties } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion'

interface Tilt3DProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** amplitude max en degrés */
  max?: number
  /** reflet lumineux qui suit la souris */
  glare?: boolean
  glareColor?: string
  /** léger zoom au survol */
  scale?: number
}

/**
 * Inclinaison 3D au survol souris (désactivée au tactile et en reduced-motion).
 * Les enfants peuvent sortir du plan avec `style={{ transform: 'translateZ(40px)' }}`.
 * NB : éviter backdrop-filter/overflow-hidden sur cet élément, ils aplatissent la 3D.
 */
export function Tilt3D({
  children, className = '', style, max = 10, glare = true, glareColor = 'rgba(255,255,255,0.35)', scale = 1.02,
}: Tilt3DProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useSpring(0, { stiffness: 160, damping: 22 })

  const spring = { stiffness: 170, damping: 18, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max * 0.8, -max * 0.8]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const s = useTransform(hover, [0, 1], [1, scale])
  const gx = useTransform(px, (v) => `${v * 100}%`)
  const gy = useTransform(py, (v) => `${v * 100}%`)
  const background = useMotionTemplate`radial-gradient(480px circle at ${gx} ${gy}, ${glareColor}, transparent 45%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    hover.set(1)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative ${className}`}
      style={reduce ? style : { ...style, rotateX, rotateY, scale: s, transformPerspective: 1100, transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && !reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ background, opacity: hover }}
        />
      )}
    </motion.div>
  )
}
