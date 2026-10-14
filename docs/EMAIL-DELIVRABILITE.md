# Délivrabilité des emails (login + commandes)

## Pourquoi les mails de login partaient en spam

`supabase.auth.signInWithOtp()` envoyait via le **SMTP mutualisé de Supabase** (`noreply@mail.app.supabase.io`) :
domaine non aligné SPF/DKIM/DMARC avec `alluvihealthcareuk.store`, IP partagée, lien `*.supabase.co`
différent du domaine du site, template sans version texte, limite de 2 mails/heure.
Gmail laisse parfois passer ; Outlook/Hotmail/Microsoft 365/Yahoo filtrent → résultats variables selon l'adresse.

## Ce que fait le code maintenant

- `POST /api/auth/magic-link` : `auth.admin.generateLink()` (aucun envoi Supabase) puis envoi via **Resend**
  depuis notre domaine. Le mail contient un **code à 6 chiffres** + un lien vers **notre domaine** (`/auth/confirm`).
- `/auth/confirm` vérifie le token **au clic** (les scanners de liens Outlook/Defender ne consomment plus le token).
- Chaque email a une version **texte**, un `Reply-To`, un seul destinataire par envoi, contenu HTML échappé.
- `/api/send-order` et `/api/send-order-email` exigent un utilisateur authentifié (propriétaire / admin)
  et relisent la commande en base : ce n'est plus un relais ouvert exploitable pour spammer depuis le domaine.

## Configuration à faire (hors code)

1. **Vercel → Environment Variables** : `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL` (voir `.env.example`).
2. **Resend → Domains** : domaine vérifié (SPF + DKIM verts). Recommandé : vérifier aussi un sous-domaine dédié
   (`mail.alluvihealthcareuk.store`) et mettre `EMAIL_FROM_AUTH="Alluvicare <auth@mail.alluvihealthcareuk.store>"`.
3. **Resend → Domain settings** : désactiver **Click tracking** et **Open tracking** (la réécriture des liens
   recrée un mismatch de domaine et peut casser les liens de connexion).
4. **DNS** : ajouter un enregistrement DMARC (absent = pénalité Outlook/Yahoo) :
   ```
   _dmarc.alluvihealthcareuk.store  TXT  "v=DMARC1; p=none; rua=mailto:support@alluvihealthcareuk.store; adkim=r; aspf=r"
   ```
   Passer à `p=quarantine` après 2-4 semaines de rapports propres.
5. **Supabase → Authentication → Emails → SMTP Settings** : configurer aussi Resend comme SMTP custom
   (`smtp.resend.com`, port 465, user `resend`, password = clé API). Les mails encore envoyés par Supabase
   (changement d'email, reset…) sortiront alors aussi de notre domaine.
6. **Supabase → Authentication → URL Configuration** : ajouter `https://alluvihealthcareuk.store/auth/confirm`
   aux Redirect URLs.

## Vérifier

```bash
dig +short TXT alluvihealthcareuk.store                     # SPF
dig +short TXT _dmarc.alluvihealthcareuk.store              # DMARC
dig +short TXT resend._domainkey.alluvihealthcareuk.store   # DKIM
```
Puis envoyer un login vers une adresse de https://www.mail-tester.com (viser ≥ 9/10).

## Limite connue

Le rate-limit de `/api/auth/magic-link` est en mémoire, donc par instance serverless. Pour une limite globale,
brancher Upstash Redis (`@upstash/ratelimit`) dans `lib/server/rate-limit.ts`.
