'use client'

// Carte qui s'incline en 3D sous le pointeur, avec reflet (glare) qui suit la souris.
// Les enfants peuvent sortir du plan via `[transform:translateZ(..px)]` (transformStyle preserve-3d).
// NB : pas de backdrop-filter ici, il aplatit le contexte 3D sur Chrome/Safari.

import { useRef, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion'

const spring = { stiffness: 160, damping: 18, mass: 0.6 }

export function TiltCard({ children, className = '', isDark }: { children: ReactNode; className?: string; isDark: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 }) // reflet visible uniquement au survol souris

  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring)
  const gx = useTransform(px, (v) => `${v * 100}%`)
  const gy = useTransform(py, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, ${
    isDark ? 'rgba(255,190,110,0.10)' : 'rgba(255,255,255,0.55)'
  }, transparent 45%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    glareOpacity.set(1)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
    glareOpacity.set(0)
  }

  return (
    <div style={{ perspective: 1400 }} className="w-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        initial={reduce ? false : { opacity: 0, rotateX: 18, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative rounded-[28px] border ${
          isDark
            ? 'border-white/[0.08] bg-[#111111]/90 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,165,47,0.04)_inset]'
            : 'border-black/[0.06] bg-white/90 shadow-[0_40px_100px_-30px_rgba(120,53,15,0.35)]'
        } ${className}`}
      >
        {/* Liseré lumineux en haut */}
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFA52F]/70 to-transparent" />
        {children}
        <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare, opacity: glareOpacity }} />
      </motion.div>
    </div>
  )
}
