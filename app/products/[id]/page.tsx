'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingCart, CheckCircle2, Share2, Facebook, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Tilt3D } from '@/components/motion/Tilt3D'
import { Float } from '@/components/motion/ScrollScene'
import { Magnetic } from '@/components/motion/Magnetic'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { EASE_OUT } from '@/components/motion/tokens'

// Colonne d'infos : cascade au chargement (au-dessus de la ligne de flottaison → pas d'attente du scroll)
const infoContainer = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }
const infoItem = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE_OUT } },
}

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  // --- 1. SEO : TITRE DE LA PAGE DYNAMIQUE ---
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Alluvi Health-Care Precision Research`;
    }
  }, [product])

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (!error) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)
    if (existingIndex > -1) { cart[existingIndex].quantity += quantity } 
    else { cart.push({ ...product, quantity }) }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#EF6C00]"></div></div>
  if (!product) return <div className="min-h-screen bg-white flex items-center justify-center uppercase font-bold">Product Not Found</div>

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">
      <Header />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -30, rotateX: -70, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            style={{ transformPerspective: 600 }}
            className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] bg-[#EF6C00] text-white px-8 py-3 rounded-full shadow-xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 size={18} /> {product.name} added to cart
          </motion.div>
        )}
      </AnimatePresence>

      {/* Utilisation de <main> et <article> pour le SEO Structurel */}
      <main>
        <article>
          {/* --- FIL D'ARIANE --- */}
          <div className="container mx-auto px-6 pt-10">
            <nav className="text-[10px] text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Link href="/" className="hover:text-[#EF6C00]">Shop</Link> 
              <span>/</span> 
              <span className="text-gray-900 font-semibold">{product.name}</span>
            </nav>
          </div>

          {/* --- SECTION PRODUIT PRINCIPALE --- */}
          <section className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Visuel : entre en pivotant, s'incline sous la souris, lévite */}
            <motion.div
              initial={{ opacity: 0, rotateY: -35, x: -60, scale: 0.92 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT }}
              style={{ transformPerspective: 1400 }}
              className="lg:sticky lg:top-28"
            >
              <Tilt3D max={12} scale={1.01} className="rounded-xl" glareColor="rgba(255,255,255,0.5)">
                <div className="bg-[#F9F9F9] rounded-xl border border-gray-100 p-12 flex items-center justify-center relative" style={{ transformStyle: 'preserve-3d' }}>
                  <div style={{ transform: 'translateZ(60px)' }} className="w-full flex justify-center">
                    <Float amplitude={10} duration={6}>
                      {/* Ajout d'un alt descriptif pour Google Images */}
                      <img src={product.main_image_url} alt={`${product.name} - Research Compound by Alluvi`} className="w-full max-w-[450px] h-auto object-contain mix-blend-multiply" />
                    </Float>
                  </div>
                  <motion.button whileHover={{ rotate: 15, scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-sm hover:text-[#EF6C00] border border-gray-100" style={{ transform: 'translateZ(40px)' }} title="Share Product"><Share2 size={18} /></motion.button>
                </div>
              </Tilt3D>
            </motion.div>

            <motion.div className="flex flex-col" variants={infoContainer} initial="hidden" animate="show">
              {/* h1 est crucial ici pour le SEO de la page produit */}
              <motion.h1 variants={infoItem} className="text-3xl md:text-5xl font-bold mb-4 tracking-tight uppercase">{product.name}</motion.h1>
              
              <motion.div variants={infoItem} className="flex items-center gap-1 mb-6 text-[#EF6C00]">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-lg inline-block"
                    initial={{ scale: 0, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.5 + i * 0.07 }}
                  >
                    ★
                  </motion.span>
                ))}
                <span className="text-gray-400 text-[11px] ml-3 font-bold uppercase tracking-widest">(2 CUSTOMER REVIEWS)</span>
              </motion.div>

              {/* 1ER EMPLACEMENT : EXTRAIT DE LA DESCRIPTION */}
              <motion.div variants={infoItem} className="mb-8 border-t border-gray-100 pt-6">
                <div 
                  className="text-gray-600 text-sm leading-relaxed line-clamp-3 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: product.description || "Premium laboratory research compound." }}
                />
              </motion.div>

              <motion.p variants={infoItem} className="text-[#D32F2F] text-4xl font-bold mb-10">£{product.price}</motion.p>

              <motion.div variants={infoItem} className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center border border-gray-200 rounded-lg h-14 bg-white overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-gray-400 hover:text-black transition-colors border-r border-gray-100" aria-label="Decrease quantity"><Minus size={16} /></button>
                  {/* Le chiffre bascule en 3D à chaque changement */}
                  <div className="relative w-12 h-full flex items-center justify-center overflow-hidden" style={{ perspective: 300 }} aria-live="polite">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={quantity}
                        initial={{ rotateX: -90, y: -14, opacity: 0 }}
                        animate={{ rotateX: 0, y: 0, opacity: 1 }}
                        exit={{ rotateX: 90, y: 14, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                        className="font-bold text-sm tabular-nums"
                      >
                        {quantity}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-5 text-gray-400 hover:text-black transition-colors border-l border-gray-100" aria-label="Increase quantity"><Plus size={16} /></button>
                </div>

                <Magnetic strength={0.15} className="flex-1 min-w-[200px]">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="group relative w-full overflow-hidden h-14 bg-[#EF6C00] hover:bg-black text-white rounded-lg font-bold uppercase text-[11px] tracking-[0.2em] transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg shadow-orange-100 disabled:bg-gray-300"
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[130%]" />
                    <ShoppingCart size={18} className="relative" /> <span className="relative">{product.stock > 0 ? 'Add To Cart' : 'Out of Stock'}</span>
                  </motion.button>
                </Magnetic>
              </motion.div>
            </motion.div>
          </section>

          {/* --- BARRE D'AVANTAGES --- */}
          <section className="bg-[#FFF8F1] py-10 border-y border-orange-50">
            <Stagger className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.12}>
              {['Money Back Guarantee', 'Top Quality Vegan Item', 'Fast & Secure Checkout'].map((label) => (
                <StaggerItem key={label} variant="scale" className="flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-700">
                  <span className="text-[#EF6C00] text-xl">✔</span> {label}
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          {/* --- 2ÈME EMPLACEMENT : DESCRIPTION COMPLÈTE --- */}
          <section className="container mx-auto px-6 py-24 max-w-4xl">
            <Reveal className="flex gap-10 border-b border-gray-100 mb-12">
              <button className="pb-5 border-b-2 border-[#EF6C00] font-bold text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]">Description</button>
              <button className="pb-5 font-bold text-[11px] uppercase tracking-[0.2em] text-gray-400">Reviews (2)</button>
            </Reveal>

            <Reveal className="prose prose-neutral max-w-none" delay={0.1}>
              <div 
                className="text-gray-600 text-[15px] leading-[1.8] whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: product.description || "Full product details are being updated." }}
              />
              
              {/* Warning de sécurité (Conformité & Confiance SEO) */}
              <Reveal variant="tilt" className="mt-16 p-8 bg-red-50 border border-red-100 rounded-2xl">
                <h4 className="text-red-700 font-bold text-xs uppercase tracking-[0.2em] mb-3">Legal Notice</h4>
                <p className="text-red-600/80 text-[13px] leading-relaxed italic">
                  This research compound is for laboratory use only. Not for human or veterinary use. Alluvi Health-Care ensures high-purity standards for scientific research purposes.
                </p>
              </Reveal>
            </Reveal>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}