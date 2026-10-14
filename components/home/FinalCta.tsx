'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { SplitText } from '@/components/motion/SplitText'
import { Magnetic } from '@/components/motion/Magnetic'

export function FinalCta({ kicker }: { kicker: string }) {
  return (
    <section className="relative bg-[#050505] py-32 overflow-hidden border-t border-white/5">
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#EF6C00]/10 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <Reveal>
          <p className="text-[#EF6C00] font-bold text-lg md:text-xl mb-8 tracking-tight">{kicker}</p>
        </Reveal>

        <Reveal variant="scale" delay={0.1}>
          <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-[-0.04em] flex items-center gap-3 mb-10">
            ALLUVI
            <motion.img
              src="/leaf-white.png"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
              alt="Labs Logo"
              animate={{ rotateY: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{ transformPerspective: 400 }}
            />
            LABS
          </h2>
        </Reveal>

        <h3 className="text-white text-3xl md:text-5xl font-semibold mb-12 tracking-tight leading-tight max-w-3xl">
          <SplitText text="Engineered For Research Precision." delay={0.15} />
        </h3>

        <Reveal delay={0.3}>
          <Magnetic>
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center px-10 py-4 border border-white/60 rounded-lg overflow-hidden text-white font-bold uppercase text-[12px] tracking-[0.15em]"
            >
              <span className="absolute inset-0 bg-[#EF6C00] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="relative z-10 flex items-center gap-3">
                Shop Alluvi Items <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>

      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`, backgroundSize: '30px 30px' }}
      />
    </section>
  )
}
