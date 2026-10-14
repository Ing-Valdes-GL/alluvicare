'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check } from 'lucide-react'
import { Float } from '@/components/motion/ScrollScene'
import type { HomeProduct } from './types'

/** Confirmation d'ajout au panier : la carte bascule en 3D depuis l'arrière. */
export function AddedToCartModal({ product, onClose }: { product: HomeProduct | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none" style={{ perspective: 1200 }}>
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, rotateX: 35, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateX: -20, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0, rotateY: -180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
                className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#EF6C00] text-white"
              >
                <Check size={24} strokeWidth={3} />
              </motion.div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Added to cart</p>
              <Float amplitude={6} duration={4}>
                <img src={product.main_image_url} className="w-24 h-24 mx-auto object-contain mb-4" alt={product.name} />
              </Float>
              <h6 className="font-bold text-sm mb-6 text-black">{product.name}</h6>
              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 bg-[#EF6C00] text-white py-3 rounded-md font-black uppercase text-[10px] transition-transform active:scale-95">
                  Continue
                </button>
                <Link href="/cart" className="flex-1 bg-black text-white py-3 rounded-md font-black uppercase text-[10px] flex items-center justify-center gap-2 transition-transform active:scale-95">
                  Cart <ShoppingCart size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
