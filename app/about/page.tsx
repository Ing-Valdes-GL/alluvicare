'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, ShoppingBag, Percent, Truck } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

// NOTE : L'export metadata a été supprimé d'ici car "use client" l'interdit.
// Le titre est maintenant géré par le useEffect ci-dessous.

export default function AboutPage() {
  
  useEffect(() => {
    // Met à jour le titre de l'onglet pour Google et l'utilisateur
    document.title = "About Our Labs | Alluvi Health-Care Precision Research";
    
    // Met à jour la meta description dynamiquement
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Learn more about Alluvi Health-Care's mission, our commitment to safety, and our expertise in pharmaceutical supply chains.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <Header />

      <main>
        {/* --- SECTION 1 : HERO --- */}
        <section className="pt-32 pb-16 border-b border-gray-100">
          <div className="container mx-auto px-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#EF6C00] mb-4">Discovery</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">
              About Our Labs
              <span className="sr-only"> - Pharmaceutical Logistics & Precision Research UK</span>
            </h1>
            <div className="w-24 h-[2px] bg-[#EF6C00] mx-auto"></div>
          </div>
        </section>

        {/* --- SECTION 2 : TESTIMONIAL & SERVICES --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto bg-[#FFF9F5] rounded-3xl p-10 md:p-16 text-center mb-24">
               <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6 block">
                 Message from the store owner
               </span>
               <h2 className="text-xl md:text-2xl font-medium leading-relaxed italic text-gray-800 mb-8">
                 "Our mission is to provide the highest purity compounds with absolute transparency. Innovation in healthcare starts with precision in the lab."
               </h2>
               <p className="text-[#EF6C00] font-bold text-xs uppercase tracking-widest">
                 Allen Bryant <span className="text-gray-400 font-normal ml-2">— Alluvi Health-Care</span>
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { title: "Specialized Labs", icon: <ShoppingBag size={28} />, desc: "Cutting-edge pharmaceutical research facilities." },
                { title: "Research Focused", icon: <Percent size={28} />, desc: "Precision-led compound development and testing." },
                { title: "Global Logistics", icon: <Truck size={28} />, desc: "Secure, temperature-controlled delivery worldwide." }
              ].map((item, index) => (
                <article key={index} className="group border border-gray-100 rounded-2xl p-10 text-center hover:border-[#EF6C00]/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-[#FFF5EB] text-[#EF6C00] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 3 : STATS --- */}
        <section className="bg-[#1A3C34] py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-white text-xl md:text-3xl font-medium max-w-3xl mx-auto mb-20 leading-snug">
              Advanced Logistics Are Not Just About Speed, But About The Integrity Of Every Compound We Deliver.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto border-t border-white/10 pt-16">
              <div>
                <p className="text-[#EF6C00] text-4xl font-bold mb-2">3M+</p>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">Compounds Delivered</p>
              </div>
              <div>
                <p className="text-[#EF6C00] text-4xl font-bold mb-2">15</p>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">Verified Hubs</p>
              </div>
              <div>
                <p className="text-[#EF6C00] text-4xl font-bold mb-2">4.7k+</p>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">Professional Partners</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 4 : BANNIÈRE --- */}
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
            <div className="md:w-1/2">
              <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tight">Precision Research,<br/>Exceptional Results.</h3>
              <p className="text-gray-500 mb-10 text-lg font-light leading-relaxed">
                Our facilities meet the rigorous standards of modern science. We ensure every batch is verified for the highest consistency in pharmaceutical research.
              </p>
              <Link href="/products" className="inline-flex items-center gap-4 bg-[#EF6C00] text-white px-10 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-black transition-all shadow-xl shadow-orange-100">
                Explore Products <ArrowRight size={18} />
              </Link>
            </div>
            <div className="md:w-1/2">
               <div className="aspect-[4/5] bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="/about-lab.jpg" 
                    className="w-full h-full object-cover" 
                    alt="Alluvi Health-Care Advanced Research Laboratory Facility and Compound Testing" 
                  />
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes marquee-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
          animation: marquee-fast 20s linear infinite;
        }
      `}</style>
    </div>
  )
}