// SERVER ONLY
import { Resend } from 'resend'
import type { EmailContent } from '@/lib/email/templates'

let resend: Resend | null = null
const getResend = () => (resend ??= new Resend(process.env.RESEND_API_KEY))

// Expéditeurs séparés : la réputation des mails d'auth reste isolée de celle des mails de commande.
// Pour isoler totalement, vérifier un sous-domaine dans Resend (ex: mail.alluvihealthcareuk.store) et le mettre en env.
export const FROM_AUTH = process.env.EMAIL_FROM_AUTH || 'Alluvicare <auth@alluvihealthcareuk.store>'
export const FROM_ORDERS = process.env.EMAIL_FROM_ORDERS || 'Alluvicare <orders@alluvihealthcareuk.store>'
export const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@alluvihealthcareuk.store'

export async function sendEmail(params: { from: string; to: string; content: EmailContent; tag: string }) {
  const { data, error } = await getResend().emails.send({
    from: params.from,
    to: [params.to], // un destinataire par envoi : jamais d'adresses croisées dans "to"
    replyTo: REPLY_TO,
    subject: params.content.subject,
    html: params.content.html,
    text: params.content.text,
    tags: [{ name: 'category', value: params.tag }],
  })
  if (error) throw new Error(`Resend: ${error.message}`)
  return data
}
