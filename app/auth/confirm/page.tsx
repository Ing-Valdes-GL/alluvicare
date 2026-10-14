'use client'

// Atterrissage du lien email. La vérification se fait au CLIC, pas au chargement :
// les scanners de liens (Outlook SafeLinks, Defender, antivirus d'entreprise) ouvrent les URLs
// avant l'utilisateur et consommeraient le token à usage unique.

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { EmailOtpType } from '@supabase/supabase-js'
import { ArrowRight, Check, Loader2, TriangleAlert } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { safeNextPath } from '@/lib/site'
import { AuthShell, useIsDark } from '@/components/auth/AuthShell'
import { TiltCard } from '@/components/auth/TiltCard'

const OTP_TYPES: readonly EmailOtpType[] = ['magiclink', 'signup', 'email', 'invite', 'recovery', 'email_change']
const isOtpType = (v: string | null): v is EmailOtpType => !!v && (OTP_TYPES as readonly string[]).includes(v)

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ConfirmPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <ConfirmFlow />
      </Suspense>
    </AuthShell>
  )
}

function ConfirmFlow() {
  const router = useRouter()
  const params = useSearchParams()
  const isDark = useIsDark()

  const tokenHash = params.get('token_hash')
  const type = params.get('type')
  const next = safeNextPath(params.get('next'))
  const valid = !!tokenHash && isOtpType(type)

  const [status, setStatus] = useState<Status>(valid ? 'idle' : 'error')
  const [error, setError] = useState(valid ? '' : 'This sign-in link is incomplete.')

  const confirm = async () => {
    if (!tokenHash || !isOtpType(type) || status === 'loading') return
    setStatus('loading')
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) {
      setStatus('error')
      setError(
        /expired|invalid/i.test(error.message)
          ? 'This link has expired or was already used.'
          : 'We could not sign you in with this link.'
      )
      return
    }
    setStatus('success')
    setTimeout(() => router.replace(next), 1000)
  }

  const muted = isDark ? 'text-white/50' : 'text-black/50'

  return (
    <TiltCard isDark={isDark} className="p-7 text-center sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={status === 'loading' ? 'idle' : status}
          initial={{ opacity: 0, rotateX: -40, y: 20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: 40, y: -20 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center" style={{ transform: 'translateZ(60px)' }}>
            <motion.div
              animate={status === 'error' ? { rotateY: 0 } : { rotateY: [0, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                status === 'error' ? 'bg-red-500/15 text-red-500' : 'bg-[#FFA52F] text-black'
              }`}
            >
              {status === 'success' ? <Check size={30} strokeWidth={3} /> : status === 'error' ? <TriangleAlert size={28} /> : (
                <span className="text-xl font-bold tracking-[-0.05em]">A</span>
              )}
            </motion.div>
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-[-0.045em] sm:text-4xl" style={{ transform: 'translateZ(40px)' }}>
            {status === 'success' ? "You're in." : status === 'error' ? 'Link not valid' : 'Confirm sign-in'}
          </h1>
          <p className={`mx-auto mt-3 max-w-[30ch] text-[15px] leading-relaxed ${muted}`}>
            {status === 'success'
              ? 'Redirecting…'
              : status === 'error'
                ? `${error} Request a new code to continue.`
                : 'One tap to finish signing in to your Alluvicare account.'}
          </p>

          <div className="mt-9" style={{ transform: 'translateZ(30px)' }}>
            {status === 'error' ? (
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FFA52F] px-6 py-4 text-[15px] font-semibold text-black transition-transform active:scale-[0.97]"
              >
                Get a new code <ArrowRight size={17} />
              </Link>
            ) : status !== 'success' ? (
              <motion.button
                type="button"
                onClick={confirm}
                disabled={status === 'loading'}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FFA52F] px-6 py-4 text-[15px] font-semibold text-black shadow-[0_12px_40px_-12px_rgba(255,165,47,0.8)] disabled:opacity-60"
              >
                {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <>Continue <ArrowRight size={17} /></>}
              </motion.button>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </TiltCard>
  )
}
