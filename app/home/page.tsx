'use client'

import { useEffect, useState } from 'react'
import { Smartphone, Zap, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { addToCart } from '@/lib/cart'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HomeHero } from '@/components/home/HomeHero'
import { BestSellers } from '@/components/home/BestSellers'
import { EvaluationSection, PromoBanner, InfoBar } from '@/components/home/Showcase'
import { FinalCta } from '@/components/home/FinalCta'
import { AddedToCartModal } from '@/components/home/AddedToCartModal'
import type { HomeProduct } from '@/components/home/types'

const INFO_ITEMS = [
  { icon: Zap, title: 'Fastest Delivery', text: 'Donec eget vestibulum quam' },
  { icon: ShieldCheck, title: 'Quality Products', text: '100% Lab Tested & Verified' },
  { icon: Smartphone, title: 'Secure Payments', text: 'Encrypted Transaction Data' },
]

export default function HomePage() {
  const [products, setProducts] = useState<HomeProduct[]>([])
  const [addedProduct, setAddedProduct] = useState<HomeProduct | null>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(3) // Ajusté pour laisser de la place aux nouvelles sections
      .then(({ data }) => setProducts((data as HomeProduct[]) || []))
  }, [])

  const handleAdd = (product: HomeProduct) => {
    addToCart(product)
    setAddedProduct(product)
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0B]">
      <Header />
      <head>
        <meta name="robots" content="noindex, follow" />
      </head>

      <HomeHero
        arches={{ left: '/hero-right-arch.png', right: '/hero-left-arch.png' }}
        tagline={<>Savor the Taste of <span className="text-[#EF6C00] font-bold">Alluvi UK</span> Lifestyle!</>}
      />

      <BestSellers products={products} onAdd={handleAdd} />

      <EvaluationSection
        badgeClassName="bg-[#8BC34A]"
        description={<>Part of <span className="text-[#EF6C00] font-bold">Alluvi Labs&apos;</span> ongoing research program into advanced GLP-1 multi-agonist compounds. This formulation is supplied in controlled batches for laboratory analysis of stability, compound behaviour, and injector system performance.</>}
        notice="Not for human or veterinary consumption."
      />

      <PromoBanner diagonal />
      <InfoBar items={INFO_ITEMS} />

      <AddedToCartModal product={addedProduct} onClose={() => setAddedProduct(null)} />

      <FinalCta kicker="A Vegan Haven for Heartful Living" />

      <Footer />
    </div>
  )
}
