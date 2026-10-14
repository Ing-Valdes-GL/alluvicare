import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/server/supabase-admin'
import { sendEmail, FROM_AUTH } from '@/lib/server/mailer'
import { rateLimit, clientIp } from '@/lib/server/rate-limit'
import { loginEmail } from '@/lib/email/templates'
import { SITE_URL, safeNextPath } from '@/lib/site'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const WINDOW_MS = 10 * 60 * 1000

/**
 * Envoie le mail de connexion via Resend (domaine aligné SPF/DKIM) au lieu du SMTP mutualisé Supabase.
 * Le mail contient un code à usage unique ET un lien sur NOTRE domaine (/auth/confirm),
 * au lieu d'un lien *.supabase.co qui crée un mismatch de domaine pénalisé par les filtres anti-spam.
 */
export async function POST(req: Request) {
  let body: { email?: unknown; next?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  const next = safeNextPath(body.next)

  // Anti email-bombing : par IP et par adresse cible
  for (const [key, limit] of [[`ip:${clientIp(req)}`, 10], [`email:${email}`, 3]] as const) {
    const rl = rateLimit(`magic:${key}`, limit, WINDOW_MS)
    if (!rl.ok) {
      return NextResponse.json(
        { error: `Too many requests. Try again in ${Math.ceil(rl.retryAfter / 60)} min.` },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
      )
    }
  }

  try {
    // Ne déclenche AUCUN envoi côté Supabase. Crée l'utilisateur s'il n'existe pas (même comportement que signInWithOtp).
    const { data, error } = await getSupabaseAdmin().auth.admin.generateLink({ type: 'magiclink', email })
    if (error) throw error

    const { hashed_token, email_otp, verification_type } = data.properties
    const link =
      `${SITE_URL}/auth/confirm?` +
      new URLSearchParams({ token_hash: hashed_token, type: verification_type, next }).toString()

    await sendEmail({ from: FROM_AUTH, to: email, content: loginEmail({ link, code: email_otp }), tag: 'auth' })

    return NextResponse.json({ success: true, codeLength: email_otp.length })
  } catch (err) {
    console.error('[magic-link]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Could not send the sign-in email. Please try again.' }, { status: 500 })
  }
}
