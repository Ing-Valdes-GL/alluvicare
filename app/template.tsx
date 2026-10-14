'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT } from '@/components/motion/tokens'

// Re-monté à chaque navigation : transition d'entrée de page façon Apple (fondu + léger glissé).
// Uniquement opacity/y : en fin d'animation framer remet `transform: none`, donc aucun impact
// sur les éléments `position: fixed` des pages (modales, toasts).
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE_OUT }}>
      {children}
    </motion.div>
  )
}
