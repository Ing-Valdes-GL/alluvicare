'use client'

import { useEffect, useState } from 'react'
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

export default function HomePage() {
  const [products, setProducts] = useState<HomeProduct[]>([])
  const [addedProduct, setAddedProduct] = useState<HomeProduct | null>(null)

  useEffect(() => {
    // GESTION DU SEO DYNAMIQUE
    document.title = "Alluvi Health-Care | Secured Pharmaceutical Logistics UK";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Licensed, temperature-controlled, and discreet pharmaceutical logistics across the UK. Secure healthcare distribution.");
    }

    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(4)
      .then(({ data }) => setProducts((data as HomeProduct[]) || []))
  }, [])

  const handleAdd = (product: HomeProduct) => {
    addToCart(product)
    setAddedProduct(product)
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0B]">
      <Header />

      <HomeHero
        arches={{ left: '/hero-right-arch.png', right: '/hero-left-arch.png' }}
        tagline={<>The Gold Standard of <span className="text-[#EF6C00] font-bold">Research</span> Logistics!</>}
      />

      <BestSellers products={products} onAdd={handleAdd} />

      <EvaluationSection
        badgeClassName="bg-[#22C55E]"
        description={<>Part of <span className="text-[#EF6C00] font-bold">Alluvi Labs&apos;</span> ongoing research program. This formulation is supplied in controlled batches for laboratory analysis.</>}
        notice="Laboratory Research Only."
      />

      <PromoBanner />
      <InfoBar />

      <AddedToCartModal product={addedProduct} onClose={() => setAddedProduct(null)} />

      <FinalCta kicker="A New Era of Pharmaceutical Research" />

      <Footer />
    </div>
  )
}
