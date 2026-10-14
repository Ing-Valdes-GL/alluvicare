'use client'

// Hero 3D : arches qui suivent le pointeur et s'écartent au scroll, titre révélé mot par mot,
// sol en grille perspective + cubes flottants. Au scroll, le contenu recule et s'efface (façon apple.com).

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SplitText } from '@/components/motion/SplitText'
import { Magnetic } from '@/components/motion/Magnetic'
import { Float } from '@/components/motion/ScrollScene'
import { Cube, GridFloor } from '@/components/motion/Scene3D'
import { EASE_OUT } from '@/components/motion/tokens'

interface ArchProps {
  side: 'left' | 'right'
  src: string
  alt: string
  color: string
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  scrollX: MotionValue<number>
  scrollRotate: MotionValue<number>
}

function Arch({ side, src, alt, color, pointerX, pointerY, scrollX, scrollRotate }: ArchProps) {
  const dir = side === 'left' ? 1 : -1
  const rotateY = useTransform([pointerX, scrollRotate], ([p, r]: number[]) => p * 22 + r * dir)
  const rotateX = useTransform(pointerY, (v) => v * -14)

  return (
    <motion.div
      initial={{ opacity: 0, x: -90 * dir, rotateY: 55 * dir }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.15 }}
      className="hidden lg:block flex-shrink-0"
      style={{ perspective: 900 }}
    >
      <motion.div style={{ x: scrollX, rotateY, rotateX, transformStyle: 'preserve-3d' }} className="relative w-[280px] h-[300px]">
        {/* halo projeté derrière l'arche */}
        <div
          className="absolute inset-4 rounded-t-full blur-2xl opacity-60"
          style={{ background: color, transform: 'translateZ(-60px)' }}
        />
        <div className="relative h-full w-full rounded-t-full overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]" style={{ background: color }}>
          <img src={src} className="w-full h-full object-contain p-1 scale-110 relative z-10" alt={alt} />
          {/* reflet vitré */}
          <div className="absolute inset-0 z-20 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export function HomeHero({ tagline, arches }: { tagline: ReactNode; arches: { left: string; right: string } }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Scroll : le hero recule, les arches s'écartent
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.84])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const leftX = useTransform(scrollYProgress, [0, 1], [0, -220])
  const rightX = useTransform(scrollYProgress, [0, 1], [0, 220])
  const archScrollRotate = useTransform(scrollYProgress, [0, 1], [0, 35])

  // Pointeur : parallaxe
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 60, damping: 18 })
  const py = useSpring(my, { stiffness: 60, damping: 18 })
  const haloX = useTransform(px, (v) => `${50 + v * 30}%`)
  const haloY = useTransform(py, (v) => `${40 + v * 30}%`)
  const cubeX = useTransform(px, (v) => v * -50)
  const cubeY = useTransform(py, (v) => v * -40)
  const floorTilt = useTransform(py, (v) => 74 + v * 4)
  const haloBackground = useTransform(
    [haloX, haloY],
    ([x, y]: string[]) => `radial-gradient(600px circle at ${x} ${y}, rgba(239,108,0,0.22), transparent 60%)`
  )

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5)
      my.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  return (
    <section ref={ref} className="relative bg-[#050505] min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* FOND GRILLE TECHNIQUE (identité d'origine) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #d7cec8 1px, transparent 1px)`,
          backgroundSize: '6px 6px',
        }}
      />
      {/* Halo qui suit le pointeur */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{ background: haloBackground }}
      />
      {/* Sol 3D */}
      <GridFloor color="rgba(239,108,0,0.22)" tilt={floorTilt} className="absolute inset-x-[-60%] bottom-0 h-[55%] z-0" />
      {/* Cubes */}
      <motion.div style={{ x: cubeX, y: cubeY }} className="absolute left-[30%] top-[12%] z-0 hidden md:block opacity-70">
        <Cube size={44} duration={18} faceClassName="border-[#EF6C00]/50 bg-[#EF6C00]/[0.06]" />
      </motion.div>
      <motion.div style={{ x: cubeY, y: cubeX }} className="absolute right-[28%] bottom-[22%] z-0 hidden md:block opacity-60">
        <Cube size={30} duration={14} reverse faceClassName="border-white/30 bg-white/[0.03]" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 flex items-center justify-between">
        <Arch side="left" src={arches.left} alt="" color="#EF6C00" pointerX={px} pointerY={py} scrollX={leftX} scrollRotate={archScrollRotate} />

        {/* BLOC CENTRAL */}
        <motion.div
          style={reduce ? undefined : { scale: contentScale, opacity: contentOpacity, y: contentY }}
          className="flex flex-col items-center text-center flex-grow px-6 md:px-10 pb-16"
        >
          <motion.div
            initial={{ opacity: 0, rotateY: -180, scale: 0.5 }}
            animate={{ opacity: 0.7, rotateY: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
            style={{ transformPerspective: 600 }}
          >
            <Float amplitude={8} duration={5}>
              <img src="/leaf-icon-gray.png" className="w-14 h-14 mb-8" alt="Logo" />
            </Float>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.85] tracking-[-0.06em] uppercase mb-8">
            <SplitText text={'ALLUVI\nHEALTH CARE'} trigger="mount" delay={0.2} stagger={0.09} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.6 }}
            className="text-xl md:text-3xl text-gray-400 font-medium tracking-tight mb-12"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.8 }}
          >
            <Magnetic>
              <Link
                href="/products"
                className="group relative inline-flex overflow-hidden bg-gradient-to-r from-[#EF6C00] to-[#FF8C33] text-white px-10 md:px-14 py-5 rounded-xl font-black uppercase text-sm tracking-[0.2em] shadow-[0_15px_40px_rgba(239,108,0,0.35)] transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(239,108,0,0.55)]"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[130%]" />
                <span className="relative flex items-center gap-3">
                  Browse All Products <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>

        <Arch side="right" src={arches.right} alt="" color="#00A699" pointerX={px} pointerY={py} scrollX={rightX} scrollRotate={archScrollRotate} />
      </div>

      {/* MARQUEE */}
      <div className="absolute bottom-0 w-full bg-[#EF6C00] py-4 z-20 overflow-hidden border-t border-white/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-white font-black text-[12px] uppercase tracking-[0.3em] mx-10">
              ★ Fast Shipping on orders above £100 ★ 100% Lab Tested ★ Pure Compounds ★
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
