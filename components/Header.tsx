'use client'

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ShoppingCart, Search, Sun, Moon, Menu, X, 
  Home, Package, MessageCircle, ShieldCheck, ClipboardList 
} from "lucide-react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { EASE_OUT, SPRING_SNAPPY } from "./motion/tokens"
import { supabase } from "@/lib/supabase"
import { isAdminEmail } from '@/lib/admin'
import { useSession } from '@/lib/use-session'
import { AuthButton } from './AuthButton'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useSession()
  
  // --- HEADER APPLE : se masque en descendant, réapparaît en remontant ---
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(latest > 8)
    setHidden(!isMenuOpen && latest > prev && latest > 140)
  })

  // --- ÉTAT DU PANIER ---
  const [cartCount, setCartCount] = useState(0)

  // 1. Fonction pour calculer le nombre total d'articles
  const updateCartBadge = () => {
    if (typeof window !== 'undefined') {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
      const totalItems = savedCart.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0)
      setCartCount(totalItems)
    }
  }

  useEffect(() => {
    // Initialisation au montage
    updateCartBadge()

    // Écouter l'événement personnalisé déclenché par la page Cart ou Products
    window.addEventListener('cart-updated', updateCartBadge)
    
    // Écouter les changements venant d'autres onglets
    window.addEventListener('storage', updateCartBadge)

    // Nettoyage des écouteurs
    return () => {
      window.removeEventListener('cart-updated', updateCartBadge)
      window.removeEventListener('storage', updateCartBadge)
    }
  }, [])

  // Statut admin recalculé à chaque connexion / déconnexion
  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      return
    }
    let cancelled = false
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data: profile }) => {
        if (!cancelled) setIsAdmin(!!profile?.is_admin || isAdminEmail(user.email))
      })
    return () => { cancelled = true }
  }, [user])

  const navLinks = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "My Orders", href: "/orders", icon: ClipboardList },
    { name: "Support", href: "/chat", icon: MessageCircle },
  ]

  return (
    
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,box-shadow,border-color] duration-500 backdrop-blur-xl backdrop-saturate-[1.8] ${
        theme === 'dark'
          ? `${scrolled ? 'bg-black/70 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]' : 'bg-black/85'} border-white/5 text-white`
          : `${scrolled ? 'bg-white/70 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.25)]' : 'bg-white/90'} border-gray-100 text-gray-900`
      }`}
    >
      
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/home" className="flex flex-col items-start group">
          <span className="text-2xl font-black tracking-tighter leading-none group-hover:text-brand-primary transition-colors">
            ALLUVI<span className="text-brand-primary italic">.</span>
          </span>
          <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-40">HEALTH CARE</span>
        </Link>

        {/* NAVIGATION CENTRALE */}
        <nav className="hidden lg:flex items-center bg-gray-500/5 p-1.5 rounded-2xl border border-white/5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-opacity duration-300 ${
                  isActive ? 'text-brand-primary' : 'opacity-40 hover:opacity-100'
                }`}
              >
                {/* Pastille active qui glisse d'un lien à l'autre */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={SPRING_SNAPPY}
                    className="absolute inset-0 rounded-xl bg-brand-primary/10 shadow-sm"
                  />
                )}
                <link.icon size={14} className={`relative ${isActive ? 'text-brand-primary' : ''}`} />
                <span className="relative">{link.name}</span>
              </Link>
            )
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className="ml-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-primary/30 text-brand-primary bg-brand-primary/5 hover:bg-brand-primary hover:text-white transition-all animate-pulse hover:animate-none"
            >
              <ShieldCheck size={14} />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* ICONES DE DROITE */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2 px-3 py-1.5 bg-gray-500/5 rounded-full border border-white/5">
            

            {/* BADGE ACTUALISÉ ICI */}
            <Link href="/cart" className="p-2 rounded-full hover:bg-white/10 transition-colors relative group">
              <ShoppingCart size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount} // re-pop à chaque ajout
                    initial={{ scale: 0, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    className="absolute top-0 right-0 bg-brand-primary text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

          <AuthButton tone={theme === 'dark' ? 'dark' : 'light'} />

          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9, rotate: 90 }}
            aria-label="Toggle theme"
            className={`p-3 rounded-xl transition-colors border ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-yellow-400/10' 
                : 'bg-gray-100 border-gray-200 text-indigo-600 hover:bg-indigo-600/10'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                className="block"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <button 
            className="lg:hidden p-3 rounded-xl bg-brand-primary text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE : rideau qui se déplie + liens en cascade 3D */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className={`lg:hidden absolute top-full left-0 w-full border-b p-6 space-y-3 shadow-2xl ${
              theme === 'dark' ? 'bg-black border-white/10' : 'bg-white border-gray-100'
            }`}
            style={{ perspective: 800 }}
          >
            {[...navLinks, ...(isAdmin ? [{ name: "Admin Panel", href: "/admin", icon: ShieldCheck }] : [])].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, rotateX: -60, y: -10 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE_OUT }}
                style={{ transformOrigin: 'top center' }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] ${
                    link.name === "Admin Panel" 
                    ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                    : pathname === link.href ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-brand-primary/5'
                  }`}
                >
                  <link.icon size={18} className={link.name === "Admin Panel" ? "text-brand-primary" : "opacity-50"} />
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}