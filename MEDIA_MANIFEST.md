# MEDIA_MANIFEST — état des médias

Source de vérité : `src/content/media-plan.json` (frames, versions, statut) → manifeste typé
`src/content/media-manifest.ts` → composants (`SequenceCanvas`, `VideoPreview`, `ScrubPoster`, `MotionFallback`).

Statut actuel : **placeholder** pour les huit expériences. Les fichiers sont des compositions procédurales
générées par `scripts/generate-placeholder-media.mjs` (SVG → WebP via sharp, previews WebM VP8 via ffmpeg).
Aucun appel à une API de génération n'existe dans le runtime du site.

| # | Expérience | Statut | Source desktop | Version mobile | Poster | Frames | Poids (desktop / mobile) | Preview | Chemin public |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | Descente sous-marine | placeholder | `seq/v1/desktop/000–071.webp` (1280×720) | `seq/v1/mobile/000–071.webp` (540×960) | `poster.webp` 14 Ko · `poster-mobile.webp` 10 Ko | 72 | 623 Ko / 470 Ko | `preview.webm` 223 Ko | `/media/01-deep-sea/` |
| 02 | Portfolio personnel | placeholder | `seq/v1/desktop/000–047.webp` | `seq/v1/mobile/000–047.webp` | 5 Ko · 3 Ko | 48 | 202 Ko / 129 Ko | 76 Ko | `/media/02-personal-portfolio/` |
| 03 | Produit de luxe | placeholder | `seq/v1/desktop/000–047.webp` | `seq/v1/mobile/000–047.webp` | 13 Ko · 8 Ko | 48 | 338 Ko / 230 Ko | 189 Ko | `/media/03-luxury-product/` |
| 04 | Restaurant | placeholder | `seq/v1/desktop/000–035.webp` | `seq/v1/mobile/000–035.webp` | 12 Ko · 8 Ko | 36 | 336 Ko / 243 Ko | 177 Ko | `/media/04-restaurant/` |
| 05 | Immobilier | placeholder | `seq/v1/desktop/000–059.webp` | `seq/v1/mobile/000–059.webp` | 10 Ko · 7 Ko | 60 | 443 Ko / 327 Ko | 184 Ko | `/media/05-real-estate/` |
| 06 | Automobile | placeholder | `seq/v1/desktop/000–059.webp` | `seq/v1/mobile/000–059.webp` | 8 Ko · 4 Ko | 60 | 386 Ko / 258 Ko | 163 Ko | `/media/06-automotive/` |
| 07 | SaaS | placeholder | `seq/v1/desktop/000–035.webp` | `seq/v1/mobile/000–035.webp` | 16 Ko · 12 Ko | 36 | 456 Ko / 384 Ko | 233 Ko | `/media/07-saas/` |
| 08 | Fitness | placeholder | `seq/v1/desktop/000–035.webp` | `seq/v1/mobile/000–035.webp` | 7 Ko · 4 Ko | 36 | 191 Ko / 128 Ko | 78 Ko | `/media/08-fitness/` |

Chaque dossier contient aussi `stills/<id>.webp` et `stills/<id>-mobile.webp` pour les scènes secondaires
(voir `MEDIA_NEEDED.md`). Le rapport machine est écrit dans `public/media/placeholder-report.json`.

## Champs du manifeste typé (`SceneMedia`)

| Champ | Description |
| --- | --- |
| `id` | Identifiant `slug:scène` |
| `status` | `placeholder` · `generated` · `missing` |
| `version` | Version des séquences (dossier `seq/<version>/`) |
| `poster.desktop` / `poster.mobile` | Posters (chargés en premier, jamais de rectangle vide) |
| `sequence.desktop` / `sequence.mobile` | `{ dir, frameCount, width, height, extension }` |
| `video` | Sources vidéo optionnelles `{ webm, mp4 }` |
| `focal` | Point focal (0..1) protégé lors du recadrage `cover` |
| `scrollHeight` | Hauteur de la scène en svh |

## Remplacer les médias par les vrais films

1. Produire les exports selon `MEDIA_NEEDED.md` (mêmes noms de fichiers, nouvelle version, ex. `seq/v2/`).
2. Mettre à jour `src/content/media-plan.json` : `version`, `frames` par expérience, `status: "generated"`.
3. Ajouter `preview.mp4` H.264 faststart à côté du `preview.webm` si souhaité (déclaré dans `media-manifest.ts`, bloc `video.desktop`).
4. Aucun composant n'a besoin d'être modifié. Lancer `npm run verify`.

## Budgets

| Budget | Cible | État placeholders |
| --- | --- | --- |
| Premier poster mobile | < 250 Ko | 3–12 Ko ✔ |
| Preview d'accueil | < 1,5 Mo | 76–233 Ko ✔ |
| Média mobile d'une scène | < 6 Mo | 128–470 Ko ✔ |
| Média desktop d'une scène | < 12 Mo | 191–623 Ko ✔ |
