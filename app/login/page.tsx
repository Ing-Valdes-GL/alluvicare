'use client'

import { Suspense, useEffect, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Loader2, Check, RotateCw, PenLine } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { requestLoginEmail, verifyLoginCode } from '@/lib/auth-client'
import { safeNextPath } from '@/lib/site'
import { AuthShell, useIsDark } from '@/components/auth/AuthShell'
import { TiltCard } from '@/components/auth/TiltCard'
import { OtpInput } from '@/components/auth/OtpInput'

type Step = 'email' | 'code' | 'success'

const RESEND_COOLDOWN_S = 60
const ease = [0.25, 0.46, 0.45, 0.94] as const

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <LoginFlow />
      </Suspense>
    </AuthShell>
  )
}

function LoginFlow() {
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNextPath(params.get('next'))
  const isDark = useIsDark()
  const reduce = useReducedMotion()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeLength, setCodeLength] = useState(6)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorKey, setErrorKey] = useState(0)
  const [cooldown, setCooldown] = useState(0)

  // Déjà connecté → on saute le login
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(next)
    })
  }, [router, next])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const fail = (message: string) => {
    setError(message)
    setErrorKey((k) => k + 1)
  }

  const sendCode = async (e?: FormEvent) => {
    e?.preventDefault()
    if (loading || cooldown > 0) return
    setLoading(true)
    setError(null)
    try {
      const { codeLength } = await requestLoginEmail(email, next)
      setCodeLength(codeLength)
      setCode('')
      setStep('code')
      setCooldown(RESEND_COOLDOWN_S)
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const verify = async (value: string) => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      await verifyLoginCode(email, value)
      setStep('success')
      setTimeout(() => router.replace(next), 1100)
    } catch (err) {
      setCode('')
      fail(err instanceof Error ? err.message : 'Invalid code.')
    } finally {
      setLoading(false)
    }
  }

  const muted = isDark ? 'text-white/50' : 'text-black/50'

  // Transition entre étapes : la carte "pivote" sur l'axe Y
  const flip = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, rotateY: 75, x: 40 },
    animate: { opacity: 1, rotateY: 0, x: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, rotateY: -75, x: -40 },
    transition: { duration: 0.55, ease },
  }

  return (
    <TiltCard isDark={isDark} className="p-7 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {step === 'email' && (
          <motion.form key="email" {...flip} onSubmit={sendCode} style={{ transformStyle: 'preserve-3d' }} noValidate>
            <div style={{ transform: 'translateZ(50px)' }}>
              <StepBadge isDark={isDark}>Sign in</StepBadge>
              <h1 className="mt-5 text-[2.6rem] font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
                Welcome
                <br />
                <span className="bg-gradient-to-r from-[#FFA52F] to-[#FFD363] bg-clip-text text-transparent">back.</span>
              </h1>
              <p className={`mt-4 text-[15px] leading-relaxed ${muted}`}>
                Enter your email and we&apos;ll send you a one-time code. No password needed.
              </p>
            </div>

            <div className="mt-9 space-y-4" style={{ transform: 'translateZ(30px)' }}>
              <label className="block">
                <span className={`mb-2 block text-[11px] uppercase tracking-[0.2em] [font-family:var(--font-auth-mono)] ${muted}`}>
                  Email address
                </span>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-2xl border px-5 py-4 text-[16px] outline-none transition-all duration-200 placeholder:opacity-40 focus:border-[#FFA52F] focus:shadow-[0_0_0_4px_rgba(255,165,47,0.15)] ${
                    isDark ? 'border-white/10 bg-white/[0.03]' : 'border-black/10 bg-white'
                  }`}
                />
              </label>

              <ErrorLine message={error} />

              <PrimaryButton loading={loading} disabled={!email.trim()}>
                Continue
              </PrimaryButton>
            </div>
          </motion.form>
        )}

        {step === 'code' && (
          <motion.div key="code" {...flip} style={{ transformStyle: 'preserve-3d' }}>
            <div style={{ transform: 'translateZ(50px)' }}>
              <StepBadge isDark={isDark}>Verify</StepBadge>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-[2.75rem]">Check your inbox.</h1>
              <p className={`mt-4 text-[15px] leading-relaxed ${muted}`}>
                We sent a {codeLength}-digit code to{' '}
                <span className={isDark ? 'text-white' : 'text-black'}>{email.trim().toLowerCase()}</span>. You can also
                tap the link in the email.
              </p>
            </div>

            <form
              className="mt-9 space-y-5"
              style={{ transform: 'translateZ(30px)' }}
              onSubmit={(e) => {
                e.preventDefault()
                if (code.length === codeLength) verify(code)
              }}
            >
              <OtpInput
                length={codeLength}
                value={code}
                onChange={(v) => {
                  setCode(v)
                  if (error) setError(null)
                }}
                onComplete={verify}
                disabled={loading}
                errorKey={errorKey}
                isDark={isDark}
              />

              <ErrorLine message={error} />

              <PrimaryButton loading={loading} disabled={code.length !== codeLength}>
                Verify & sign in
              </PrimaryButton>

              <div className={`flex items-center justify-between text-sm ${muted}`}>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setError(null)
                  }}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#FFA52F]"
                >
                  <PenLine size={14} /> Change email
                </button>
                <button
                  type="button"
                  onClick={() => sendCode()}
                  disabled={cooldown > 0 || loading}
                  className="inline-flex items-center gap-1.5 tabular-nums transition-colors enabled:hover:text-[#FFA52F] disabled:opacity-50"
                >
                  <RotateCw size={14} /> {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                </button>
              </div>

              <p className={`text-center text-xs ${isDark ? 'text-white/30' : 'text-black/35'}`}>
                Can&apos;t find it? Check your spam or promotions folder.
              </p>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" {...flip} className="flex flex-col items-center py-8 text-center">
            <SuccessMark />
            <h1 className="mt-8 text-3xl font-bold tracking-[-0.04em]">You&apos;re in.</h1>
            <p className={`mt-2 text-[15px] ${muted}`}>Redirecting…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </TiltCard>
  )
}

// ---------- UI atoms ----------

function StepBadge({ children, isDark }: { children: string; isDark: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] [font-family:var(--font-auth-mono)] ${
        isDark ? 'border-[#FFA52F]/25 bg-[#FFA52F]/[0.06] text-[#FFA52F]' : 'border-[#e8891c]/25 bg-[#FFA52F]/10 text-[#b45309]'
      }`}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      {children}
    </span>
  )
}

function PrimaryButton({ children, loading, disabled }: { children: string; loading: boolean; disabled?: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={loading || disabled}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FFA52F] px-6 py-4 text-[15px] font-semibold text-black shadow-[0_12px_40px_-12px_rgba(255,165,47,0.8)] transition-[opacity,box-shadow] hover:shadow-[0_16px_50px_-10px_rgba(255,165,47,0.9)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    >
      {/* reflet qui balaie le bouton au survol */}
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          {children}
          <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </>
      )}
    </motion.button>
  )
}

function ErrorLine({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-500"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function SuccessMark() {
  return (
    <div className="relative" style={{ perspective: 600 }}>
      <motion.div
        className="absolute inset-0 rounded-full bg-[#FFA52F]/40 blur-2xl"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.6, opacity: [0, 1, 0.5] }}
        transition={{ duration: 1 }}
      />
      <motion.div
        initial={{ rotateY: -180, scale: 0.4 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#FFA52F] text-black"
      >
        <Check size={38} strokeWidth={3} />
      </motion.div>
    </div>
  )
}
