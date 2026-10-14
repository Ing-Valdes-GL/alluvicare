'use client'

import { motion } from 'framer-motion'
import { EASE_OUT, VIEWPORT_ONCE } from './tokens'

interface SplitTextProps {
  text: string
  className?: string
  wordClassName?: (word: string, index: number) => string | undefined
  delay?: number
  stagger?: number
  /** 'view' = au scroll, 'mount' = immédiatement (hero) */
  trigger?: 'view' | 'mount'
}

/**
 * Titre révélé mot par mot : chaque mot bascule en 3D depuis sous sa ligne (masque overflow).
 * Le texte complet reste lisible par les lecteurs d'écran et les moteurs de recherche.
 */
export function SplitText({ text, className, wordClassName, delay = 0, stagger = 0.06, trigger = 'view' }: SplitTextProps) {
  const lines = text.split('\n')
  let index = 0
  const animateProps = trigger === 'mount' ? { animate: 'show' } : { whileInView: 'show', viewport: VIEWPORT_ONCE }

  return (
    <motion.span
      className={className}
      aria-label={text.replace(/\n/g, ' ')}
      initial="hidden"
      {...animateProps}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      style={{ display: 'block' }}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.split(' ').map((word) => {
            const i = index++
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom [perspective:600px]">
                <motion.span
                  className={`inline-block origin-bottom ${wordClassName?.(word, i) ?? ''}`}
                  variants={{
                    hidden: { y: '110%', rotateX: -70, opacity: 0 },
                    show: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 1, ease: EASE_OUT } },
                  }}
                >
                  {word}
                </motion.span>
                {' '}
              </span>
            )
          })}
        </span>
      ))}
    </motion.span>
  )
}
