// URL publique canonique. Ne JAMAIS dériver les liens email de l'en-tête Host/Origin
// (host-header injection => liens de connexion pointant vers un domaine tiers).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://alluvihealthcareuk.store').replace(/\/+$/, '')

// N'accepte qu'un chemin interne ("/orders"), jamais "//evil.com" ni "https://..." (open redirect).
export function safeNextPath(next: unknown, fallback = '/orders'): string {
  if (typeof next !== 'string') return fallback
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return fallback
  return next
}
