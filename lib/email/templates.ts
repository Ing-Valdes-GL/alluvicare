// Templates email transactionnels.
// Délivrabilité : chaque mail a une version texte, un seul domaine de lien (= domaine expéditeur),
// pas d'image, pas de vocabulaire médical/pharma dans les mails d'authentification.

export interface EmailContent {
  subject: string
  html: string
  text: string
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const money = (n: unknown) => {
  const v = Number(n)
  return `£${(Number.isFinite(v) ? v : 0).toFixed(2)}`
}

function layout(preheader: string, body: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Alluvicare</title></head>
<body style="margin:0;padding:0;background:#f5f5f7;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;font-family:-apple-system,'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1d1d1f;">
<tr><td style="padding:32px 36px 0;font-size:15px;font-weight:700;letter-spacing:-0.02em;">Alluvi<span style="color:#e8891c;">care</span></td></tr>
<tr><td style="padding:24px 36px 32px;font-size:15px;line-height:1.6;">${body}</td></tr>
<tr><td style="padding:20px 36px;border-top:1px solid #eeeeef;font-size:12px;line-height:1.5;color:#86868b;">
Alluvi Health-Care · London, United Kingdom<br>Questions? Reply to this email or write to support@alluvihealthcareuk.store
</td></tr>
</table>
</td></tr></table>
</body></html>`
}

// ---------- AUTH ----------

export function loginEmail(params: { link: string; code: string }): EmailContent {
  const { link, code } = params
  const safeLink = escapeHtml(link)
  const spacedCode = escapeHtml(code.split('').join(' '))
  return {
    subject: `Your Alluvicare sign-in code: ${code}`,
    text: [
      'Sign in to your Alluvicare account',
      '',
      `Your code: ${code}`,
      '',
      'Or open this link on the same device:',
      link,
      '',
      'The code and link expire in 1 hour and can be used once.',
      "If you didn't request this, you can ignore this email — your account stays secure.",
    ].join('\n'),
    html: layout(
      `Your sign-in code is ${code}`,
      `<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;letter-spacing:-0.03em;">Sign in to Alluvicare</h1>
<p style="margin:0 0 24px;color:#6e6e73;">Enter this code on the sign-in page:</p>
<p style="margin:0 0 28px;padding:18px 0;background:#f5f5f7;border-radius:14px;text-align:center;font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:30px;font-weight:700;letter-spacing:0.3em;color:#1d1d1f;">${spacedCode}</p>
<p style="margin:0 0 16px;color:#6e6e73;">Or sign in with one click:</p>
<p style="margin:0 0 28px;"><a href="${safeLink}" style="display:inline-block;padding:14px 28px;border-radius:980px;background:#1d1d1f;color:#ffffff;text-decoration:none;font-weight:600;">Sign in</a></p>
<p style="margin:0;font-size:13px;color:#86868b;">The code and link expire in 1 hour and work once. If you didn't request this, ignore this email.</p>`
    ),
  }
}

// ---------- ORDERS ----------

export interface OrderEmailItem {
  product_name: string
  quantity: number
  unit_price: number
}

export interface OrderEmailData {
  reference: string
  createdAt: string
  firstName: string
  lastName: string
  email: string
  companyName?: string | null
  streetAddress?: string | null
  apartment?: string | null
  townCity?: string | null
  county?: string | null
  postcode?: string | null
  country?: string | null
  phone?: string | null
  paymentMethod?: string | null
  subtotal: number
  discount: number
  shipping: number
  total: number
  items: OrderEmailItem[]
}

export function orderReceivedEmail(o: OrderEmailData): EmailContent {
  const rows = o.items
    .map(
      (i) => `<tr>
<td style="padding:10px 0;border-bottom:1px solid #eeeeef;">${escapeHtml(i.product_name)} <span style="color:#86868b;">× ${escapeHtml(i.quantity)}</span></td>
<td style="padding:10px 0;border-bottom:1px solid #eeeeef;text-align:right;">${money(i.unit_price * i.quantity)}</td></tr>`
    )
    .join('')

  const address = [
    `${o.firstName} ${o.lastName}`,
    o.companyName,
    o.streetAddress,
    o.apartment,
    [o.townCity, o.county].filter(Boolean).join(', '),
    o.postcode,
    o.country,
    o.phone,
  ].filter(Boolean) as string[]

  const totals: [string, string][] = [
    ['Subtotal', money(o.subtotal)],
    ...(o.discount > 0 ? [['Discount', `-${money(o.discount)}`] as [string, string]] : []),
    ['Shipping', money(o.shipping)],
  ]

  return {
    subject: `Order #${o.reference} received`,
    text: [
      `Hi ${o.firstName},`,
      '',
      `We've received your order #${o.reference} (${o.createdAt}). It is on hold until your payment is confirmed.`,
      '',
      ...o.items.map((i) => `- ${i.product_name} × ${i.quantity}: ${money(i.unit_price * i.quantity)}`),
      '',
      ...totals.map(([k, v]) => `${k}: ${v}`),
      `Total: ${money(o.total)}`,
      o.paymentMethod ? `Payment method: ${o.paymentMethod}` : '',
      '',
      'Billing address:',
      ...address,
    ].join('\n'),
    html: layout(
      `Order #${o.reference} received — awaiting payment confirmation`,
      `<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;letter-spacing:-0.03em;">Thanks, ${escapeHtml(o.firstName)}.</h1>
<p style="margin:0 0 24px;color:#6e6e73;">We've received order <strong style="color:#1d1d1f;">#${escapeHtml(o.reference)}</strong> (${escapeHtml(o.createdAt)}). It's on hold until your payment is confirmed.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">${rows}
${totals.map(([k, v]) => `<tr><td style="padding:6px 0;color:#6e6e73;">${k}</td><td style="padding:6px 0;text-align:right;">${v}</td></tr>`).join('')}
<tr><td style="padding:12px 0 0;font-weight:700;font-size:17px;">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:17px;">${money(o.total)}</td></tr>
</table>
${o.paymentMethod ? `<p style="margin:20px 0 0;font-size:14px;color:#6e6e73;">Payment method: ${escapeHtml(o.paymentMethod)}</p>` : ''}
<p style="margin:24px 0 6px;font-weight:600;">Billing address</p>
<p style="margin:0;font-size:14px;color:#6e6e73;">${address.map(escapeHtml).join('<br>')}</p>`
    ),
  }
}

export function orderStatusEmail(params: {
  reference: string
  total: number
  status: 'confirmed' | 'rejected'
  reason?: string | null
}): EmailContent {
  const { reference, total, status } = params
  const reason = params.reason?.trim() || 'Your order could not be verified.'

  if (status === 'confirmed') {
    return {
      subject: `Order #${reference} confirmed`,
      text: `Your order #${reference} has been confirmed.\nTotal paid: ${money(total)}\n\nYour package is being prepared for dispatch. We'll be in touch with tracking details.`,
      html: layout(
        `Order #${reference} confirmed`,
        `<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;letter-spacing:-0.03em;">Your order is confirmed.</h1>
<p style="margin:0 0 24px;color:#6e6e73;">Order <strong style="color:#1d1d1f;">#${escapeHtml(reference)}</strong> has been verified.</p>
<p style="margin:0 0 24px;padding:18px 20px;background:#f5f5f7;border-radius:14px;"><span style="display:block;font-size:12px;color:#86868b;">Total paid</span><span style="font-size:26px;font-weight:700;">${money(total)}</span></p>
<p style="margin:0;color:#6e6e73;">Your package is being prepared for dispatch. We'll be in touch with tracking details.</p>`
      ),
    }
  }

  return {
    subject: `Order #${reference} cancelled`,
    text: `Your order #${reference} has been cancelled.\nReason: ${reason}\n\nIf you were charged, a refund is processed within 3-5 business days. Reply to this email if you think this is a mistake.`,
    html: layout(
      `Order #${reference} cancelled`,
      `<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;letter-spacing:-0.03em;">Your order was cancelled.</h1>
<p style="margin:0 0 20px;color:#6e6e73;">Order <strong style="color:#1d1d1f;">#${escapeHtml(reference)}</strong> has been cancelled.</p>
<p style="margin:0 0 24px;padding:16px 20px;border-left:3px solid #e5484d;background:#fff5f5;border-radius:0 12px 12px 0;"><strong>Reason</strong><br><span style="color:#6e6e73;">${escapeHtml(reason)}</span></p>
<p style="margin:0;color:#6e6e73;">If you were charged, a refund is processed within 3-5 business days. Reply to this email if you think this is a mistake.</p>`
    ),
  }
}
