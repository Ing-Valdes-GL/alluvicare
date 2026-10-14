'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/lib/use-session'

// Pages qui n'ont plus de sens une fois déconnecté → retour à l'accueil
const PROTECTED = ['/orders', '/admin', '/chat', '/checkout2']

const flip = {
  initial: { opacity: 0, rotateX: -90 },
  animate: { opacity: 1, rotateX: 0 },
  exit: { opacity: 0, rotateX: 90 },
  transition: { duration: 0.25 },
}

/** Bouton compact Sign in / Sign out. `tone` = couleur du fond sur lequel il est posé. */
export function AuthButton({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { user, ready } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const base = `inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
    tone === 'dark'
      ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
      : 'border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
  }`

  const signOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut({ scope: 'local' }) // cet appareil uniquement
    setSigningOut(false)
    if (PROTECTED.some((p) => pathname.startsWith(p))) router.push('/')
    else router.refresh()
  }

  // Placeholder invisible pendant la lecture de la session : évite le saut de layout
  if (!ready) return <span className={`${base} invisible`} aria-hidden><LogIn size={16} /></span>

  const next = pathname && pathname !== '/login' ? `?next=${encodeURIComponent(pathname)}` : ''

  return (
    <span style={{ perspective: 400 }} className="inline-flex">
      <AnimatePresence mode="wait" initial={false}>
        {user ? (
          <motion.button
            key="out"
            {...flip}
            whileTap={{ scale: 0.92 }}
            onClick={signOut}
            disabled={signingOut}
            title={`Signed in as ${user.email ?? ''}`}
            aria-label="Sign out"
            className={base}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-[10px] font-black text-white">
              {(user.email ?? '?').charAt(0).toUpperCase()}
            </span>
            {signingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
            <span className="hidden sm:inline">Sign out</span>
          </motion.button>
        ) : (
          <motion.span key="in" {...flip} className="inline-flex">
            <Link href={`/login${next}`} aria-label="Sign in" className={`${base} !border-brand-primary/30 !bg-brand-primary !text-white hover:!bg-brand-accent`}>
              <LogIn size={15} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
