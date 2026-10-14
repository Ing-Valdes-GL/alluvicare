'use client'

import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from './tokens'

interface AnimatedNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  /** 'view' : compte depuis 0 à l'apparition ; 'change' : glisse de l'ancienne à la nouvelle valeur */
  mode?: 'view' | 'change'
  duration?: number
}

/** Compteur animé — écrit directement dans le DOM (aucun re-render React par frame). */
export function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '', className, mode = 'change', duration = 1.2 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(mode === 'view' ? 0 : value)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const format = (n: number) => `${prefix}${n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`

  useEffect(() => {
    const el = ref.current
    if (!el || (mode === 'view' && !inView)) return
    if (reduce) {
      el.textContent = format(value)
      prev.current = value
      return
    }
    const controls = animate(prev.current, value, {
      duration: mode === 'view' ? duration : 0.6,
      ease: EASE_OUT,
      onUpdate: (v) => { el.textContent = format(v) },
    })
    prev.current = value
    return () => controls.stop()
    // format dépend de props stables (decimals/prefix/suffix)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, mode, reduce])

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {format(mode === 'view' ? 0 : value)}
    </span>
  )
}
