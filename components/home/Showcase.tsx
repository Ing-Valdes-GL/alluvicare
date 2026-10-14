'use client'

// Sections "vitrine" de la home : produit qui pivote au scroll, bannière promo qui se redresse,
// barre d'avantages avec icônes qui basculent.

import type { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Smartphone, Zap, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { ScrollScene, Float } from '@/components/motion/ScrollScene'
import { SplitText } from '@/components/motion/SplitText'
import { Magnetic } from '@/components/motion/Magnetic'

export function EvaluationSection({ badgeClassName, description, notice }: { badgeClassName: string; description: ReactNode; notice: string }) {
  return (
    <section className="py-24 bg-[#F9F9F9] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <Stagger className="lg:w-1/2" stagger={0.1}>
            <StaggerItem>
              <motion.div
                whileHover={{ rotateY: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                style={{ transformPerspective: 400 }}
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-8 shadow-lg shadow-green-200 ${badgeClassName}`}
              >
                <img src="/leaf-white.png" className="w-6 h-6" alt="" />
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">
                <SplitText text={'Retatrutide – Pre-Filled Pen\nEvaluation'} />
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-gray-500 leading-relaxed mb-6 max-w-lg">{description}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-10">{notice}</p>
            </StaggerItem>
            <StaggerItem>
              <Magnetic strength={0.2}>
                <Link href="/about" className="bg-[#EF6C00] text-white px-8 py-4 rounded-lg font-black uppercase text-[10px] tracking-widest flex items-center gap-3 w-fit hover:bg-black transition-colors duration-300 shadow-xl shadow-orange-200">
                  About Store <ArrowRight size={14} />
                </Link>
              </Magnetic>
            </StaggerItem>
          </Stagger>

          <div className="lg:w-1/2 relative">
            {/* Le produit pivote en 3D pendant qu'il traverse l'écran */}
            <ScrollScene className="relative z-10" rotateY={[-32, 0, 24]} rotateX={[14, 0, -8]} scale={[0.82, 1.05, 0.95]} y={[80, 0, -60]}>
              <Float amplitude={14} duration={7}>
                <img src="/supplement-box.png" alt="Supplement Box" className="w-full drop-shadow-[0_45px_45px_rgba(0,0,0,0.2)] lg:translate-x-10" />
              </Float>
            </ScrollScene>
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#EF6C00]/[0.06] -z-0 rounded-[40%_60%_70%_30%/40%_50%_60%_70%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function PromoBanner({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <section className="py-10">
      <div className="container mx-auto px-6">
        <Reveal variant="tilt">
          <div className="bg-[#050A30] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[380px]">
            <Stagger className="flex-1 p-12 lg:p-20 z-10" stagger={0.12}>
              <StaggerItem>
                <h3 className="text-white text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter">
                  No Prep. No Hassle.<br />Just Precision Dosing.
                </h3>
              </StaggerItem>
              <StaggerItem>
                <p className="text-[#EF6C00] text-2xl font-black mb-10">Upto 35% off today!</p>
              </StaggerItem>
              <StaggerItem>
                <Magnetic strength={0.25}>
                  <Link href="/products" className="inline-flex items-center gap-3 border-2 border-white/20 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                    Shop Now <ArrowRight size={14} />
                  </Link>
                </Magnetic>
              </StaggerItem>
            </Stagger>
            <div className="flex-1 bg-[#EF6C00] w-full h-full min-h-[380px] flex items-center justify-center relative overflow-hidden">
              {diagonal && (
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-[#050A30] hidden md:block z-10" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }} />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <ScrollScene className="absolute -left-20 top-1/2 -translate-y-1/2" y={[60, -60]}>
                  <h4 className="text-white text-7xl font-black opacity-40 rotate-[-90deg] whitespace-nowrap">Alluvi Labs</h4>
                </ScrollScene>
                {/* Le téléphone monte et se redresse en 3D avec le scroll */}
                <ScrollScene className="relative" y={[140, 20, -30]} rotateY={[-30, 0, 12]} rotateZ={[-10, 0, 4]} rotateX={[20, 0, -6]}>
                  <img src="/phone-app.png" className="w-48 lg:w-64 drop-shadow-2xl translate-y-8" alt="App Preview" />
                </ScrollScene>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export interface InfoItem {
  icon: LucideIcon
  title: string
  text: string
}

export const DEFAULT_INFO_ITEMS: InfoItem[] = [
  { icon: Zap, title: 'Fastest Delivery', text: 'Reliable UK Wide Logistics' },
  { icon: ShieldCheck, title: 'Quality Products', text: '100% Lab Tested & Verified' },
  { icon: Smartphone, title: 'Secure Payments', text: 'Encrypted Transaction Data' },
]

export function InfoBar({ items = DEFAULT_INFO_ITEMS }: { items?: InfoItem[] }) {
  return (
    <section className="bg-[#E9DCC5] py-20 mt-10">
      <div className="container mx-auto px-6">
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-12 text-black" stagger={0.12}>
          {items.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title} className="flex items-center gap-6 group">
              <motion.div
                whileHover={{ rotateY: 360, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                style={{ transformPerspective: 500 }}
                className="w-16 h-16 border-2 border-black/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-black group-hover:text-[#E9DCC5]"
              >
                <Icon size={28} />
              </motion.div>
              <div>
                <h5 className="font-black text-sm uppercase tracking-wider mb-1">{title}</h5>
                <p className="text-[11px] font-bold text-black/50 uppercase">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
