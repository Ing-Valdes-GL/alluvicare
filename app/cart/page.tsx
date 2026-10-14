'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SplitText } from '@/components/motion/SplitText'
import { Reveal } from '@/components/motion/Reveal'
import { AnimatedNumber } from '@/components/motion/AnimatedNumber'
import { Magnetic } from '@/components/motion/Magnetic'
import { EASE_OUT } from '@/components/motion/tokens'

/** Chiffre qui bascule en 3D quand il change (quantités). */
function FlipDigit({ value }: { value: number }) {
  return (
    <span className="relative inline-flex h-5 w-6 items-center justify-center overflow-hidden" style={{ perspective: 200 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ rotateX: -90, y: -10, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1 }}
          exit={{ rotateX: 90, y: 10, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          className="text-sm font-semibold text-slate-700 tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // État pour les informations de livraison
  const [shippingInfo, setShippingInfo] = useState({
    country: 'United Kingdom (UK)',
    county: '',
    townCity: '',
    postcode: ''
  })

  // Chargement du panier local au montage du composant
  useEffect(() => {
    const loadLocalCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(savedCart)
      setLoading(false)
    }
    loadLocalCart()
  }, [])

  // Mise à jour de la quantité
  const updateQuantity = (productId: string, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    })
    saveCart(updatedCart)
  }

  // Suppression d'un article
  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId)
    saveCart(updatedCart)
  }

  // Sauvegarde globale du panier
  const saveCart = (newCart: any[]) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    // Notifier les autres composants (comme le badge du Header)
    window.dispatchEvent(new Event('cart-updated'))
  }

  // Calculs financiers
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCost = 30.00
  const total = subtotal + shippingCost

  // Fonction de redirection vers le checkout
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.")
      return
    }
    // On peut aussi passer les infos de shipping via le state ou le localStorage si besoin
    router.push('/checkout')
  }

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans">
      <Header />

      {/* Hero Header - Design épuré */}
      <div className="bg-[#FFFBF7] py-16 text-center border-b border-orange-50/50">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          <SplitText text="Your Cart" trigger="mount" />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
          className="text-slate-500 text-sm mt-2 font-medium"
        >
          Review your items before secure checkout
        </motion.p>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* COLONNE GAUCHE : LISTE PRODUITS & SHIPPING */}
          <div className="lg:col-span-2 space-y-12">
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-slate-400">Product</th>
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-slate-400">Price</th>
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-slate-400 text-center">Quantity</th>
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-slate-400">Subtotal</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence initial={false}>
                  {cartItems.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 24, rotateX: -20 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: EASE_OUT, delay: loading ? 0 : index * 0.06 } }}
                      exit={{ opacity: 0, x: -60, transition: { duration: 0.35 } }}
                      style={{ transformPerspective: 800 }}
                      className="group"
                    >
                      <td className="py-6 flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-lg p-1 flex items-center justify-center border border-slate-100 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                          <img 
                            src={item.image_url || item.main_image_url} 
                            className="max-h-full max-w-full object-contain" 
                            alt={item.name} 
                          />
                        </div>
                        <span className="font-medium text-slate-900 text-sm">{item.name}</span>
                      </td>
                      <td className="py-6 text-sm text-slate-500 font-medium">£{item.price.toFixed(2)}</td>
                      <td className="py-6">
                        <div className="flex items-center justify-between bg-slate-50 rounded-md px-2 py-1.5 w-24 mx-auto border border-slate-200/50">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-orange-500 transition-colors">
                            <Minus size={14}/>
                          </button>
                          <FlipDigit value={item.quantity} />
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-orange-500 transition-colors">
                            <Plus size={14}/>
                          </button>
                        </div>
                      </td>
                      <td className="py-6 font-bold text-sm text-slate-900">£{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-6 text-right">
                        <motion.button whileHover={{ rotate: -12, scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-400 transition-colors" aria-label={`Remove ${item.name}`}>
                          <Trash2 size={16} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                </tbody>
              </table>
              <AnimatePresence>
                {!loading && cartItems.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center gap-4 text-slate-400 text-sm italic"
                  >
                    <motion.div animate={{ y: [0, -8, 0], rotateY: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} style={{ transformPerspective: 400 }}>
                      <ShoppingBag size={40} className="text-slate-200" />
                    </motion.div>
                    Your cart is currently empty.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECTION SHIPPING INFORMATION */}
            <Reveal className="pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold mb-6 text-slate-900">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                   <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-orange-200 transition-all appearance-none text-slate-600"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                   >
                     <option>United Kingdom (UK)</option>
                     <option>United States (US)</option>
                     <option>France</option>
                   </select>
                </div>
                <input 
                  type="text" placeholder="County" 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-orange-200"
                  value={shippingInfo.county}
                  onChange={(e) => setShippingInfo({...shippingInfo, county: e.target.value})}
                />
                <input 
                  type="text" placeholder="Town / City" 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-orange-200"
                  value={shippingInfo.townCity}
                  onChange={(e) => setShippingInfo({...shippingInfo, townCity: e.target.value})}
                />
                <input 
                  type="text" placeholder="Postcode" 
                  className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-orange-200"
                  value={shippingInfo.postcode}
                  onChange={(e) => setShippingInfo({...shippingInfo, postcode: e.target.value})}
                />
                <div className="flex items-center">
                  <button className="bg-orange-400 text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-sm">
                    Update Shipping
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* COLONNE DROITE : RÉSUMÉ (VIOLET) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, rotateY: 30, x: 60 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.2 }}
              style={{ transformPerspective: 1200 }}
              className="bg-[#3D002E] rounded-3xl p-8 text-white sticky top-28 shadow-xl border border-white/5"
            >
              <h2 className="text-lg font-bold mb-8 opacity-90"><AnimatedNumber value={cartItems.length} /> Items In Cart</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Subtotal</span>
                  <AnimatedNumber className="font-semibold text-base" value={subtotal} decimals={2} prefix="£" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Shipping</span>
                    <span className="font-semibold text-base">£{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-orange-300 font-bold text-[9px] uppercase tracking-widest mb-1">Express Delivery</p>
                    <p className="text-[10px] opacity-40 leading-relaxed">Fast tracked delivery to your address.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-sm uppercase opacity-60">Total</span>
                    <AnimatedNumber className="text-3xl font-bold tracking-tight" value={total} decimals={2} prefix="£" />
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <Magnetic strength={0.12} className="w-full">
                    <button 
                      onClick={handleProceedToCheckout}
                      className="relative overflow-hidden w-full bg-[#EF6C00] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.15em] shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[130%]" />
                      Proceed To Checkout 
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Magnetic>
                  
                  <button 
                    onClick={() => saveCart([...cartItems])}
                    className="w-full border border-white/20 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Update Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}