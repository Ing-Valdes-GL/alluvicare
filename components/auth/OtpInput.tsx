'use client'

// Saisie de code à usage unique : un seul <input> réel (autofill iOS/Android "one-time-code", collage),
// cases visuelles animées par-dessus. Chaque chiffre "bascule" en 3D à l'arrivée ; secousse en cas d'erreur.

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface OtpInputProps {
  length: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  errorKey?: number // incrémenter pour déclencher la secousse
  isDark: boolean
}

export function OtpInput({ length, value, onChange, onComplete, disabled, errorKey = 0, isDark }: OtpInputProps) {
  const reduce = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  const handle = (raw: string) => {
    const next = raw.replace(/\D/g, '').slice(0, length)
    onChange(next)
    if (next.length === length) onComplete?.(next)
  }

  return (
    <motion.div
      key={errorKey}
      animate={errorKey > 0 && !reduce ? { x: [0, -12, 12, -8, 8, -3, 0] } : undefined}
      transition={{ duration: 0.45 }}
      className="relative"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => handle(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        disabled={disabled}
        maxLength={length}
        aria-label={`${length}-digit sign-in code`}
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
      />
      <div className="flex justify-between gap-2" style={{ perspective: 600 }}>
        {Array.from({ length }).map((_, i) => {
          const char = value[i]
          const active = focused && (i === value.length || (i === length - 1 && value.length === length))
          return (
            <div
              key={i}
              className={`relative flex aspect-[4/5] flex-1 items-center justify-center rounded-2xl border text-2xl font-semibold tabular-nums transition-all duration-200 sm:text-3xl ${
                active
                  ? 'border-[#FFA52F] shadow-[0_0_0_4px_rgba(255,165,47,0.18)]'
                  : char
                    ? isDark ? 'border-white/20' : 'border-black/15'
                    : isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'
              } ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]'}`}
            >
              <AnimatePresence mode="popLayout">
                {char && (
                  <motion.span
                    key={char + i}
                    initial={reduce ? false : { rotateX: -90, y: -10, opacity: 0 }}
                    animate={{ rotateX: 0, y: 0, opacity: 1 }}
                    exit={{ rotateX: 90, y: 10, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  >
                    {char}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && !char && (
                <motion.span
                  className="absolute h-7 w-[2px] rounded-full bg-[#FFA52F]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
