import { NextResponse } from 'next/server'
import { getSupabaseAdmin, getRequestUser, isAdmin } from '@/lib/server/supabase-admin'
import { sendEmail, FROM_ORDERS } from '@/lib/server/mailer'
import { orderStatusEmail } from '@/lib/email/templates'

export const runtime = 'nodejs'

/**
 * Email de confirmation / annulation envoyé par un admin.
 * Sécurité : admin uniquement, commande relue en DB, `reason` échappée (injection HTML impossible).
 */
export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!(await isAdmin(user))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = (await req.json().catch(() => ({}))) as { orderId?: unknown; type?: unknown; reason?: unknown }
    if (typeof body.orderId !== 'string' || !body.orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }
    const type = typeof body.type === 'string' ? body.type.toUpperCase() : ''
    if (type !== 'CONFIRMATION' && type !== 'DELETION') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    const reason = typeof body.reason === 'string' ? body.reason.slice(0, 1000) : null

    const { data: order, error } = await getSupabaseAdmin()
      .from('orders')
      .select('id, reference_code, email_address, total_amount')
      .eq('id', body.orderId)
      .maybeSingle()
    if (error) throw error
    if (!order?.email_address) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const content = orderStatusEmail({
      reference: order.reference_code || String(order.id).slice(0, 8).toUpperCase(),
      total: Number(order.total_amount) || 0,
      status: type === 'CONFIRMATION' ? 'confirmed' : 'rejected',
      reason,
    })

    const data = await sendEmail({
      from: FROM_ORDERS,
      to: order.email_address,
      content,
      tag: type === 'CONFIRMATION' ? 'order-confirmed' : 'order-cancelled',
    })
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('[send-order-email]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Could not send email' }, { status: 500 })
  }
}
