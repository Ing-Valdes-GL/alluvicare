'use client'

// Coque commune login / confirm : scène 3D, barre haute, footer de réassurance.
// Parti pris : minimalisme Apple (whitespace, typo serrée, une seule couleur d'accent)
// + signature 3D (sol en grille, cubes, carte inclinable) qui garde l'ADN "tech" du site.

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { ArrowLeft, Moon, Sun, ShieldCheck } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { AuthScene } from './AuthScene'

const display = Geist({ subsets: ['latin'], variable: '--font-auth-display', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-auth-mono', display: 'swap' })

export function useIsDark() {
  const { theme } = useTheme()
  return theme !== 'light'
}

export function AuthShell({ children }: { children: ReactNode }) {
  const { toggleTheme } = useTheme()
  const isDark = useIsDark()

  return (
    <div
      className={`${display.variable} ${mono.variable} relative flex min-h-[100dvh] flex-col overflow-hidden [font-family:var(--font-auth-display)] transition-colors duration-500 ${
        isDark ? 'bg-[#050505] text-[#f5f5f7]' : 'bg-[#f5f5f7] text-[#1d1d1f]'
      }`}
    >
      <AuthScene isDark={isDark} />

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10 sm:py-8">
        <Link
          href="/"
          className={`group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors ${
            isDark ? 'text-white/50 hover:bg-white/5 hover:text-white' : 'text-black/50 hover:bg-black/5 hover:text-black'
          }`}
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to store</span>
        </Link>

        <span className="text-[15px] font-bold tracking-[-0.03em]">
          Alluvi<span className="text-[#FFA52F]">care</span>
        </span>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`rounded-full p-2.5 transition-colors ${isDark ? 'text-white/50 hover:bg-white/5 hover:text-white' : 'text-black/50 hover:bg-black/5 hover:text-black'}`}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
        <div className="w-full max-w-[440px]">{children}</div>
      </main>

      <footer
        className={`relative z-10 flex items-center justify-center gap-2 px-4 pb-8 text-center text-[10px] uppercase tracking-[0.16em] sm:text-[11px] sm:tracking-[0.22em] [font-family:var(--font-auth-mono)] ${
          isDark ? 'text-white/30' : 'text-black/35'
        }`}
      >
        <ShieldCheck size={13} className="shrink-0 text-[#FFA52F]" />
        <span>
          Passwordless · One-time codes<span className="hidden sm:inline"> · Encrypted session</span>
        </span>
      </footer>
    </div>
  )
}
