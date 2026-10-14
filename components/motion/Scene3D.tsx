'use client'

// Primitives de décor 3D en CSS pur (aucune lib WebGL) : cube filaire et sol en grille perspective.

import { motion, useReducedMotion, type MotionValue } from 'framer-motion'

interface CubeProps {
  size: number
  duration?: number
  reverse?: boolean
  /** classes des faces (bordure / fond) */
  faceClassName?: string
}

export function Cube({ size, duration = 24, reverse, faceClassName = 'border-[#FFA52F]/40 bg-gradient-to-br from-[#FFA52F]/[0.10] to-transparent' }: CubeProps) {
  const reduce = useReducedMotion()
  const half = size / 2
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ]
  const turn = reverse ? -360 : 360

  return (
    <motion.div
      aria-hidden
      className="relative"
      style={{ width: size, height: size, transformStyle: 'preserve-3d' }}
      initial={{ rotateX: -24, rotateY: 32 }}
      animate={reduce ? undefined : { rotateX: -24 + turn, rotateY: 32 + turn }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {faces.map((transform) => (
        <div key={transform} className={`absolute inset-0 rounded-[18%] border ${faceClassName}`} style={{ transform }} />
      ))}
    </motion.div>
  )
}

interface GridFloorProps {
  color: string
  className?: string
  /** inclinaison pilotable (parallaxe) */
  tilt?: MotionValue<number> | number
  cell?: number
}

/** Sol en grille qui défile vers le spectateur (keyframes `scene-grid` dans globals.css). */
export function GridFloor({ color, className = '', tilt = 72, cell = 64 }: GridFloorProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div aria-hidden className={`origin-bottom ${className}`} style={{ rotateX: reduce ? 72 : tilt, transformPerspective: 1000 }}>
      <div
        className={`h-full w-full [mask-image:linear-gradient(to_top,black_10%,transparent_85%)] ${reduce ? '' : 'animate-[scene-grid_6s_linear_infinite]'}`}
        style={{
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: `${cell}px ${cell}px`,
          ['--cell' as string]: `${cell}px`,
        }}
      />
    </motion.div>
  )
}
