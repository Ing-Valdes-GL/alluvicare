'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, ShoppingBag, Percent, Truck } from 'lucide-react'
import Link from 'next/link'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { SplitText } from '@/components/motion/SplitText'
import { Tilt3D } from '@/components/motion/Tilt3D'
import { ScrollScene } from '@/components/motion/ScrollScene'
import { AnimatedNumber } from '@/components/motion/AnimatedNumber'
import { Magnetic } from '@/components/motion/Magnetic'
import { EASE_OUT } from '@/components/motion/tokens'

const STATS = [
  { value: 3, decimals: 0, suffix: 'M+', label: 'Compounds Delivered' },
  { value: 15, decimals: 0, suffix: '', label: 'Verified Hubs' },
  { value: 4.7, decimals: 1, suffix: 'k+', label: 'Professional Partners' },
]

// ON A SUPPRIMÉ LE USEEFFECT DU TITRE ICI CAR IL EST GÉRÉ PAR LE SERVEUR

export default function AboutPageClient() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <Header />

      <main>
        {/* --- SECTION 1 : HERO --- */}
        <section className="pt-32 pb-16 border-b border-gray-100">
          <div className="container mx-auto px-6 text-center">
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1.2, ease: EASE_OUT }}
              className="text-[11px] uppercase font-bold text-[#EF6C00] mb-4"
            >
              Discovery
            </motion.p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
              <SplitText text="About Our Labs" trigger="mount" delay={0.2} />
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.6 }}
              className="w-24 h-[2px] bg-[#EF6C00] mx-auto"
            />
          </div>
        </section>

        {/* --- SECTION 2 : TESTIMONIAL & SERVICES --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <Reveal variant="tilt" className="max-w-3xl mx-auto bg-[#FFF9F5] rounded-3xl p-10 md:p-16 text-center mb-24">
               <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6 block">
                 Message from the store owner
               </span>
               <h2 className="text-xl md:text-2xl font-medium leading-relaxed italic text-gray-800 mb-8">
                 "Our mission is to provide the highest purity compounds with absolute transparency. Innovation in healthcare starts with precision in the lab."
               </h2>
               <p className="text-[#EF6C00] font-bold text-xs uppercase tracking-widest">
                 Allen Bryant <span className="text-gray-400 font-normal ml-2">— Alluvi Health-Care</span>
               </p>
            </Reveal>

            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-10" stagger={0.12}>
              {[
                { title: "Specialized Labs", icon: <ShoppingBag size={28} />, desc: "Cutting-edge pharmaceutical research facilities." },
                { title: "Research Focused", icon: <Percent size={28} />, desc: "Precision-led compound development and testing." },
                { title: "Global Logistics", icon: <Truck size={28} />, desc: "Secure, temperature-controlled delivery worldwide." }
              ].map((item, index) => (
                <StaggerItem key={index} variant="tilt" as="article">
                  <Tilt3D max={10} className="h-full rounded-2xl bg-white" glareColor="rgba(239,108,0,0.08)">
                    <div className="group h-full border border-gray-100 rounded-2xl p-10 text-center hover:border-[#EF6C00]/30 transition-colors duration-300" style={{ transformStyle: 'preserve-3d' }}>
                      <div
                        className="w-16 h-16 bg-[#FFF5EB] text-[#EF6C00] rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform:translateZ(30px)] group-hover:[transform:translateZ(50px)_rotateY(360deg)]"
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-3 uppercase tracking-tight" style={{ transform: 'translateZ(20px)' }}>{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </Tilt3D>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* --- SECTION 3 : STATS --- */}
        <section className="bg-[#1A3C34] py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-white text-xl md:text-3xl font-medium max-w-3xl mx-auto mb-20 leading-snug">
              <SplitText text="Advanced Logistics Are Not Just About Speed, But About The Integrity Of Every Compound We Deliver." stagger={0.025} />
            </h2>
            
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto border-t border-white/10 pt-16" stagger={0.15}>
              {STATS.map((stat) => (
                <StaggerItem key={stat.label} variant="scale">
                  <p className="text-[#EF6C00] text-4xl font-bold mb-2">
                    <AnimatedNumber mode="view" value={stat.value} decimals={stat.decimals} suffix={stat.suffix} duration={1.8} />
                  </p>
                  <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">{stat.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* --- SECTION 4 : MARQUEE --- */}
        <div className="bg-white py-10 overflow-hidden border-b border-gray-100">
          <div className="flex whitespace-nowrap animate-marquee-fast">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="text-[#1A1A1A] text-2xl md:text-3xl font-bold uppercase tracking-tighter mx-12 opacity-30">
                Precision Compounds ★ Lab Tested ★ Secure Delivery ★ Professionalism ★
              </span>
            ))}
          </div>
        </div>

        {/* --- SECTION 5 : CTA FINAL --- */}
        <section className="py-28 bg-gray-50">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
            <Stagger className="md:w-1/2" stagger={0.1}>
              <StaggerItem>
                <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">Precision Research,<br/>Exceptional Results.</h3>
              </StaggerItem>
              <StaggerItem>
                <p className="text-gray-500 mb-10 text-lg font-light leading-relaxed">
                  Our facilities meet the rigorous standards of modern science. We ensure every batch is verified for the highest consistency in pharmaceutical research.
                </p>
              </StaggerItem>
              <StaggerItem>
                <Magnetic strength={0.2}>
                  <Link href="/products" className="inline-flex items-center gap-4 bg-[#EF6C00] text-white px-10 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-black transition-colors duration-300 shadow-xl shadow-orange-100">
                    Explore Products <ArrowRight size={18} />
                  </Link>
                </Magnetic>
              </StaggerItem>
            </Stagger>
            <ScrollScene className="md:w-1/2 w-full" rotateY={[-25, 0, 10]} rotateX={[12, 0, -6]} scale={[0.85, 1, 0.97]}>
               <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="/about-lab.jpg" 
                    className="w-full h-full object-cover" 
                    alt="Alluvi Health-Care Advanced Research Laboratory Facility" 
                  />
               </div>
            </ScrollScene>
          </div>
        </section>
      </main>

      <Footer />

    </div>
  )
}