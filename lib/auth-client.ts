'use client'

import { supabase } from '@/lib/supabase'

export interface LoginEmailResult {
  codeLength: number
}

/** Demande l'envoi du mail de connexion (code + lien) via notre route Resend. */
export async function requestLoginEmail(email: string, next = '/orders'): Promise<LoginEmailResult> {
  const res = await fetch('/api/auth/magic-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), next }),
  })
  const json = (await res.json().catch(() => ({}))) as { error?: string; codeLength?: number }
  if (!res.ok) throw new Error(json.error || 'Could not send the sign-in email.')
  return { codeLength: json.codeLength ?? 6 }
}

/** Vérifie le code saisi. `type: 'email'` couvre utilisateur existant (magiclink) ET nouveau (signup). */
export async function verifyLoginCode(email: string, token: string) {
  const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token, type: 'email' })
  if (error) throw new Error(error.message.includes('expired') ? 'This code has expired. Request a new one.' : 'Invalid code.')
}

/** En-tête Authorization pour les routes API protégées. */
export async function authHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession()
  return session ? { Authorization: `Bearer ${session.access_token}` } : {}
}
