import { NextResponse } from 'next/server'
import { getSupabaseAdmin, getRequestUser } from '@/lib/server/supabase-admin'
import { sendEmail, FROM_ORDERS } from '@/lib/server/mailer'
import { orderReceivedEmail, type OrderEmailData } from '@/lib/email/templates'
import { rateLimit } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'

const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'alluvihealthcare42@gmail.com'

/**
 * Email "commande reçue".
 * Sécurité : l'appelant doit être authentifié ET propriétaire de la commande.
 * Les données viennent de la DB, pas du body (l'ancienne route était un relais ouvert :
 * n'importe qui pouvait envoyer du HTML arbitraire depuis notre domaine → réputation détruite).
 */
export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!rateLimit(`send-order:${user.id}`, 10, 60 * 60 * 1000).ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { orderId } = (await req.json().catch(() => ({}))) as { orderId?: unknown }
    if (typeof orderId !== 'string' || !orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    const db = getSupabaseAdmin()
    const { data: order, error } = await db.from('orders').select('*').eq('id', orderId).maybeSingle()
    if (error) throw error
    if (!order || order.user_id !== user.id) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const { data: items, error: itemsError } = await db
      .from('order_items')
      .select('product_name, quantity, unit_price')
      .eq('order_id', order.id)
    if (itemsError) throw itemsError

    const data: OrderEmailData = {
      reference: order.reference_code || String(order.id).slice(0, 8).toUpperCase(),
      createdAt: new Date(order.created_at ?? Date.now()).toLocaleDateString('en-GB', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
      firstName: order.first_name ?? '',
      lastName: order.last_name ?? '',
      email: order.email_address,
      companyName: order.company_name,
      streetAddress: order.street_address,
      apartment: order.apartment_suite,
      townCity: order.town_city,
      county: order.county,
      postcode: order.postcode,
      country: order.country,
      phone: order.phone,
      paymentMethod: order.payment_method,
      subtotal: Number(order.subtotal) || 0,
      discount: Number(order.discount_amount) || 0,
      shipping: Number(order.shipping_fee) || 0,
      total: Number(order.total_amount) || 0,
      items: (items ?? []).map((i) => ({
        product_name: i.product_name,
        quantity: Number(i.quantity) || 0,
        unit_price: Number(i.unit_price) || 0,
      })),
    }

    const content = orderReceivedEmail(data)
    // Envois séparés : le client ne voit pas l'adresse admin, et un signalement spam ne touche que son envoi.
    const results = await Promise.allSettled([
      sendEmail({ from: FROM_ORDERS, to: data.email, content, tag: 'order-received' }),
      sendEmail({
        from: FROM_ORDERS,
        to: ADMIN_NOTIFY_EMAIL,
        content: { ...content, subject: `[New order] #${data.reference} — ${data.email}` },
        tag: 'order-admin',
      }),
    ])

    if (results[0].status === 'rejected') throw results[0].reason
    if (results[1].status === 'rejected') console.error('[send-order] admin copy failed:', results[1].reason)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-order]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Could not send order email' }, { status: 500 })
  }
}
