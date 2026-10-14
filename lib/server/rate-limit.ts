// Rate-limit fenêtre glissante en mémoire.
// Limite : par instance serverless (Vercel peut en lancer plusieurs). Suffisant contre le spam basique ;
// pour une garantie globale, remplacer le store par Upstash Redis (@upstash/ratelimit).

const buckets = new Map<string, number[]>()

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)

  if (hits.length >= limit) {
    buckets.set(key, hits)
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) }
  }

  hits.push(now)
  buckets.set(key, hits)

  // Purge opportuniste pour éviter une fuite mémoire sur instance long-lived
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k)
  }
  return { ok: true, retryAfter: 0 }
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}
