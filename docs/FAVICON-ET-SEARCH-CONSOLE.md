# Favicon (logo dans Google) et Google Search Console

## Fichier logo requis

Pour que votre logo s’affiche à la place du globe dans les résultats Google :

1. **Placez votre logo** dans le dossier `public/` :
   - `public/logo-share.png` — image **carrée** (ex. 192×192 ou 512×512 px), format PNG.

Le site est configuré pour :
- Servir ce logo quand quelqu’un demande `/favicon.ico` (Google le fait souvent).
- L’utiliser comme favicon et icône Apple.

## Après déploiement : Google Search Console

1. Allez sur [Google Search Console](https://search.google.com/search-console).
2. Sélectionnez la propriété **alluvihealthcareuk.store**.
3. **Demander une réindexation** (optionnel mais utile) :
   - **Inspection d’URL** (menu de gauche) → entrez `https://alluvihealthcareuk.store`.
   - Cliquez sur **Demander une indexation** pour que Google repasse sur la page d’accueil.
4. **Attendre la mise à jour du favicon** :
   - Google met à jour les favicons lors de ses prochains passages (quelques jours à quelques semaines).
   - Il n’y a pas d’outil “changer le favicon” dans Search Console ; c’est automatique une fois le bon fichier en ligne.
5. Vérifiez que le favicon est bien servi :
   - Ouvrez `https://alluvihealthcareuk.store/favicon.ico` dans le navigateur : vous devez voir votre logo.
   - Ouvrez `https://alluvihealthcareuk.store/logo-share.png` : même image.

Si après 1–2 semaines le globe est encore affiché, vérifiez que `logo-share.png` est bien en `public/` et redéployez.
