'use client'

// Décor 3D de l'espace auth : sol en grille perspective qui défile, cubes filaires en rotation,
// parallaxe pilotée par le pointeur. 100% CSS 3D + framer-motion (aucune lib WebGL → 0 kB de plus).

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { Cube, GridFloor } from '@/components/motion/Scene3D'

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")"

export function AuthScene({ isDark }: { isDark: boolean }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 18 })
  const sy = useSpring(my, { stiffness: 40, damping: 18 })

  // Profondeurs différentes = vraie parallaxe
  const nearX = useTransform(sx, (v) => v * -60)
  const nearY = useTransform(sy, (v) => v * -40)
  const farX = useTransform(sx, (v) => v * 25)
  const farY = useTransform(sy, (v) => v * 18)
  const floorTilt = useTransform(sy, (v) => 72 + v * 4)

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5)
      my.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  const line = isDark ? 'rgba(255,165,47,0.16)' : 'rgba(232,137,28,0.18)'
  const face = isDark
    ? 'border-[#FFA52F]/40 bg-gradient-to-br from-[#FFA52F]/[0.10] to-transparent'
    : 'border-[#e8891c]/40 bg-gradient-to-br from-[#FFA52F]/[0.14] to-white/40'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ perspective: 1000 }}>
      {/* Halo */}
      <div
        className={`absolute left-1/2 top-[-25%] h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full blur-3xl ${
          isDark
            ? 'bg-[radial-gradient(circle,rgba(255,165,47,0.20),transparent_62%)]'
            : 'bg-[radial-gradient(circle,rgba(255,165,47,0.28),transparent_62%)]'
        }`}
      />

      {/* Sol en grille perspective */}
      <GridFloor color={line} tilt={floorTilt} className="absolute inset-x-[-60%] bottom-[-18%] h-[75vh]" />

      {/* Cubes */}
      <motion.div className="absolute right-[7%] top-[12%] hidden md:block" style={{ x: nearX, y: nearY }}>
        <Cube size={128} duration={28} faceClassName={face} />
      </motion.div>
      <motion.div className="absolute left-[9%] top-[58%] hidden lg:block" style={{ x: farX, y: farY }}>
        <Cube size={64} duration={20} reverse faceClassName={face} />
      </motion.div>
      <motion.div className="absolute left-[18%] top-[14%] hidden lg:block opacity-60" style={{ x: farX, y: nearY }}>
        <Cube size={36} duration={16} faceClassName={face} />
      </motion.div>

      {/* Grain léger pour casser l'aplat */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}
