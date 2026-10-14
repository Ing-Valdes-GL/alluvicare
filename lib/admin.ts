// Emails admin codés en dur (en plus de profiles.is_admin). Source unique pour le client et le serveur.
// NB : côté client, ce contrôle ne fait que masquer/afficher l'UI ; l'accès réel aux données reste régi par la RLS Supabase.
export const ADMIN_EMAILS: readonly string[] = ['doungmolagoungvaldes@gmail.com', 'alluvihealthcare42@gmail.com']

export const isAdminEmail = (email?: string | null): boolean => !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase())
