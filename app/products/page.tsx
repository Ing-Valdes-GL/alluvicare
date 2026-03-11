import { Metadata } from 'next'
import ProductListContent from './ProductList'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Métadonnées lues par les robots (Google, Facebook, etc.)
export const metadata: Metadata = {
  title: "Retatrutide Products & Research Compounds", 
  description: "Browse our catalog of licensed medical and pharmaceutical products including Retatrutide. Fast and secure delivery across the United Kingdom.",
  openGraph: {
    title: "Retatrutide Products & Research Compounds | Alluvi Health-Care",
    description: "Secured Pharmaceutical Logistics & Research Compounds UK.",
    images: ['/logo-share.png'],
  }
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#EF6C00]" size={48} />
      </div>
    }>
      <ProductListContent />
    </Suspense>
  )
}