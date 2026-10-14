'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Search, CheckCircle2, Percent } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Footer from '@/components/Footer'
import { AuthButton } from '@/components/AuthButton'
import { Tilt3D } from '@/components/motion/Tilt3D'
import { SplitText } from '@/components/motion/SplitText'
import { EASE_OUT } from '@/components/motion/tokens'

export default function ProductListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const [cartCount, setCartCount] = useState(0)
  
  const [showPopup, setShowPopup] = useState(false)
  const [addedItemName, setAddedItemName] = useState('')
  const [filterPromo, setFilterPromo] = useState(false)

  // Chargement des données Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('products').select('*').eq('is_active', true)
        ])
        setCategories(catRes.data || [])
        setProducts(prodRes.data || [])
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filtrage des produits
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchesSearch = p.name.toLowerCase().includes(searchValue.toLowerCase())
      const matchesPromo = filterPromo ? p.on_sale === true : true
      return matchesSearch && matchesPromo
    })
  }, [products, searchValue, filterPromo])

  // Gestion du panier (Storage)
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const totalItems = cart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
      setCartCount(totalItems)
    }
    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cart-updated', updateCartCount) 
    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cart-updated', updateCartCount)
    }
  }, [])

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)
    if (existingIndex > -1) { 
      cart[existingIndex].quantity += 1 
    } else { 
      cart.push({ ...product, quantity: 1 }) 
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cart-updated'))
    setAddedItemName(product.name)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-black">
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, y: 60, x: '-50%', rotateX: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, x: '-50%', rotateX: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 40, x: '-50%', scale: 0.95 }} 
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            style={{ transformPerspective: 800 }}
            className="fixed bottom-10 left-1/2 z-[300] bg-[#0A0A0A] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[320px] border border-white/10"
          >
            <div className="bg-green-500 p-1.5 rounded-full text-white"><CheckCircle2 size={18} /></div>
            <div className="flex-grow">
              <p className="text-[9px] uppercase font-black tracking-widest text-gray-400">Success</p>
              <p className="text-sm font-bold truncate">{addedItemName} added!</p>
            </div>
            <Link href="/cart" className="text-[#EF6C00] text-xs font-black uppercase underline decoration-2 underline-offset-4">View Cart</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <div className="bg-[#0A0A0A] text-white py-2.5 overflow-hidden border-b border-white/10 relative z-[100]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-[0.2em] mx-10">
              ★ Fast Shipping on orders above £100 ★ 100% Lab Tested Compounds ★ Secured Payments ★
            </span>
          ))}
        </div>
      </div>

      <header className="bg-white sticky top-0 z-[150] border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 md:gap-8">
          <Link href="/" title="Alluvi Home">
            <img src="/logo-share.png" alt="Alluvi Health Care Logo" className="h-10 md:h-12 hover:opacity-80 transition-opacity" />
          </Link>
          
          <div className="hidden md:flex flex-grow max-w-2xl items-center gap-3">
            <div className="flex-grow flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#EF6C00] transition-colors">
              <input 
                type="text" 
                value={searchValue} 
                onChange={(e) => setSearchValue(e.target.value)} 
                placeholder="Search research products..." 
                className="flex-grow px-6 py-2.5 text-sm outline-none text-black bg-transparent" 
              />
              <div className="bg-white px-4 flex items-center text-gray-400"><Search size={18} /></div>
            </div>
            <button 
              onClick={() => setFilterPromo(!filterPromo)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-[10px] font-black uppercase transition-all ${filterPromo ? 'bg-[#EF6C00] text-white border-[#EF6C00]' : 'text-gray-400 border-gray-200 hover:border-gray-400'}`}
            >
              <Percent size={14} /> {filterPromo ? 'On Sale' : 'All Items'}
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <AuthButton tone="light" />
            <Link href="/cart" className="relative group p-2" aria-label="View Cart">
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-[#EF6C00] transition-colors" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute top-0 right-0 bg-[#EF6C00] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        <nav className="bg-[#EF6C00]">
          <div className="container mx-auto px-4 flex items-center justify-between h-12">
            <div className="flex items-center h-full gap-8 text-white text-[10px] font-black uppercase tracking-widest overflow-x-auto no-scrollbar">
              <Link href="/">HOME</Link>
              <Link href="/products" className="border-b-2 border-white pb-1">SHOP</Link>
              <Link href="/orders">MY ORDERS</Link>
              <Link href="/chat">SUPPORT</Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="flex flex-col items-center mb-16 text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.6, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              style={{ transformPerspective: 500 }}
              className="bg-[#22C55E] text-white px-5 py-1.5 text-[9px] font-black uppercase tracking-[0.4em] mb-4 rounded-full shadow-sm"
            >
              Lab Tested Products
            </motion.span>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-gray-900 tracking-tighter max-w-4xl">
              {/* key : le titre se rejoue quand on bascule le filtre promo */}
              <SplitText key={String(filterPromo)} trigger="mount" delay={0.15} text={filterPromo ? 'Exclusive Research Deals' : 'Alluvi Compound Collection'} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.5 }}
              className="text-gray-500 mt-4 max-w-xl text-sm md:text-base italic"
            >
              Supplying the UK with pharmaceutical-grade research chemicals and precision delivery systems.
            </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="relative overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 h-[400px]">
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                  />
                </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10" style={{ perspective: 1400 }}>
            <AnimatePresence mode="popLayout">
            {filteredProducts.map((product: any, index: number) => (
              <motion.article 
                key={product.id} 
                layout 
                initial={{ opacity: 0, y: 60, rotateX: 25, scale: 0.95 }} 
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.85, rotateY: -25 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: (index % 4) * 0.08 }}
                className="group"
              >
              <Tilt3D max={9} className="h-full rounded-2xl" glareColor="rgba(239,108,0,0.10)">
              <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.3)] transition-shadow duration-500 flex flex-col">
                <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden rounded-t-2xl bg-[#FBFBFB] flex items-center justify-center p-8">
                  {product.on_sale && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-lg z-10 animate-pulse">
                      SALE
                    </div>
                  )}
                  <img 
                    src={product.main_image_url || "/placeholder.png"} 
                    className="max-h-full w-auto object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-3" 
                    alt={`${product.name} - Alluvi Healthcare UK`}
                    loading="lazy"
                  />
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[#EF6C00] text-[9px] font-black uppercase tracking-[0.2em] mb-2 block opacity-80">
                    {product.category_name || 'Laboratory'}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <h2 className="font-black text-gray-900 uppercase text-lg mb-3 leading-tight group-hover:text-[#EF6C00] transition-colors h-14 line-clamp-2">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="text-gray-500 text-xs mb-6 line-clamp-2 h-8 leading-relaxed">
                    {product.description || "High-purity laboratory research compound."}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center gap-3 mb-5">
                      <p className="text-[#EF6C00] font-black text-2xl">£{product.price}</p>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.94 }}
                      onClick={(e) => addToCart(e, product)} 
                      className="w-full bg-[#0A0A0A] text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#EF6C00] transition-colors duration-300 flex items-center justify-center gap-3"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
              </Tilt3D>
              </motion.article>
            ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center">
            <motion.div animate={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1 }} className="w-fit mx-auto">
              <Search size={48} className="mx-auto text-gray-200 mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-400 uppercase">No products found</h3>
          </motion.div>
        )}
      </main>

      <Footer />

    </div>
  )
}