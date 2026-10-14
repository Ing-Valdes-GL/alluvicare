'use client'

import { ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { SplitText } from '@/components/motion/SplitText'
import { Stagger, StaggerItem } from '@/components/motion/Reveal'
import { Tilt3D } from '@/components/motion/Tilt3D'
import type { HomeProduct } from './types'

/** Grille best-sellers : cartes qui se redressent en cascade puis s'inclinent en 3D au survol. */
export function BestSellers({ products, onAdd }: { products: HomeProduct[]; onAdd: (p: HomeProduct) => void }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            <SplitText text="Best Selling Products" />
          </h2>
        </div>

        <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-6" stagger={0.1}>
          <StaggerItem variant="tilt">
            <Tilt3D max={8} className="h-full rounded-xl" glareColor="rgba(255,255,255,0.25)">
              <div className="bg-[#EF6C00] rounded-xl p-10 flex flex-col justify-end min-h-[450px] h-full relative overflow-hidden group">
                <motion.div
                  className="absolute top-10 left-10 opacity-20"
                  animate={{ rotate: [0, 8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <img src="/leaf-bg.png" className="w-32" alt="" />
                </motion.div>
                <div className="relative z-10" style={{ transform: 'translateZ(40px)' }}>
                  <img src="/leaf-white.png" className="w-8 mb-6" alt="" />
                  <h3 className="text-3xl font-black text-white leading-tight">
                    Alluvi<br />Healthcare<br />Retatrutide
                  </h3>
                </div>
              </div>
            </Tilt3D>
          </StaggerItem>

          {products.map((product) => (
            <StaggerItem key={product.id} variant="tilt">
              <Tilt3D max={10} className="h-full rounded-xl bg-white" glareColor="rgba(239,108,0,0.10)">
                <div className="group h-full border border-gray-100 rounded-xl p-6 flex flex-col transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="aspect-square mb-6 bg-[#F7F7F7] rounded-lg flex items-center justify-center" style={{ transform: 'translateZ(30px)' }}>
                    <img
                      src={product.main_image_url}
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[#EF6C00] text-[10px] font-bold uppercase mb-1">{product.category_name || 'Uncategorized'}</p>
                  <h4 className="font-bold text-sm mb-4 h-10">{product.name}</h4>
                  <p className="text-[#A13BB4] font-black text-lg mb-6">£{product.price}</p>
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onAdd(product)}
                    style={{ transform: 'translateZ(20px)' }}
                    className="mt-auto w-full border border-gray-200 py-3 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white hover:border-black transition-colors"
                  >
                    <ShoppingCart size={14} /> Add To Cart
                  </motion.button>
                </div>
              </Tilt3D>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
