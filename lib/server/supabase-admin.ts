// SERVER ONLY — utilise la service role key (bypass RLS). Ne jamais importer depuis un composant client.
import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  client = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  return client
}

const MASTER_ADMIN_EMAIL = 'doungmolagoungvaldes@gmail.com'

/** Résout l'utilisateur depuis `Authorization: Bearer <access_token>`. */
export async function getRequestUser(req: Request): Promise<User | null> {
  const token = req.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return null
  const { data, error } = await getSupabaseAdmin().auth.getUser(token)
  return error ? null : data.user
}

/** Même règle que le dashboard admin : master email OU profiles.is_admin. */
export async function isAdmin(user: User): Promise<boolean> {
  if (user.email?.toLowerCase() === MASTER_ADMIN_EMAIL) return true
  const { data } = await getSupabaseAdmin().from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  return data?.is_admin === true
}
