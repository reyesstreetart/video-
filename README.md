# MV Design — Huit expériences web immersives

Site officiel de **MV Design**, studio digital spécialisé dans les expériences web immersives et les héros
cinématiques pilotés par le scroll. Le site est lui-même le portfolio : huit concepts expérimentaux à
traverser, chacun avec sa carte animée, sa page projet, son hero dynamique et son interaction principale.

> Des sites que l’on ne fait pas défiler. On les traverse.

## Démarrage

```bash
npm install
npm run dev          # http://localhost:3000
```

Production :

```bash
npm run build
npm run start        # http://localhost:3000
```

Vérification complète (lint + typecheck + build + tests Playwright) :

```bash
npm run verify
```

Node ≥ 20. Aucune variable d'environnement n'est requise pour lancer le site ; voir `.env.example`.

## Les huit expériences (ordre imposé)

| # | Route | Univers | Marque fictive | Interaction principale |
| --- | --- | --- | --- | --- |
| 01 | `/experiences/deep-sea-journey` | Expérience et storytelling | ABYSSAL / EREBUS | Descente continue 0 → 3 800 m, HUD de profondeur |
| 02 | `/experiences/personal-portfolio` | Portfolio personnel | Personnage fictif | Orbite 360° scrubée, nom lettre par lettre |
| 03 | `/experiences/luxury-product` | Produit de luxe | AURUM & NOIR / Eclipse | Rotation de la montre, macro, vue éclatée avec callouts |
| 04 | `/experiences/restaurant` | Restaurant | EMBER & OAK | Feu scrubé, menu Feu / Terre, réservation |
| 05 | `/experiences/real-estate` | Immobilier | THE MERIDIAN | Visite continue Approche → Terrasse |
| 06 | `/experiences/automotive` | Automobile | VANTA | Parcours 4 environnements, HUD 0 → 250 mph, configurateur |
| 07 | `/experiences/saas` | SaaS | PULSE | Dashboard HTML qui s'assemble, tarifs, FAQ |
| 08 | `/experiences/fitness` | Fitness | FORGE | Nuage de magnésie, philosophie ligne par ligne |

Tous les concepts portent la mention **« Concept expérimental MV Design »** : marques, produits, prix,
chiffres et profils sont fictifs.

Autres pages : `/`, `/experiences`, `/expertise`, `/methode`, `/studio`, `/contact`, `/mentions-legales`,
`/confidentialite`, `sitemap.xml`, `robots.txt`, `/api/contact`.

## Stack

- Next.js 15 (App Router), React 19, TypeScript strict, CSS Modules + tokens globaux.
- Composants serveur par défaut ; composants client uniquement pour le moteur d'animation et les formulaires.
- Aucune dépendance d'animation externe : le moteur repose sur le scroll natif et un unique `requestAnimationFrame`.
- Playwright pour les tests, sharp pour la génération des médias de substitution.

## Architecture

```
src/
  app/                     pages (App Router), API contact, sitemap, robots, icônes
  components/
    layout/                Header, Footer, Wordmark, SkipLink, MotionToggle, ConsentAnalytics
    motion/                ScrollChapter, SequenceCanvas, SceneOverlay, ProgressHUD,
                           VideoPreview, MotionFallback, ScrubPoster, Reveal, MotionModeProvider
    experiences/           ExperienceCard, ExperienceIndex, HomeHero, Manifesto + 8 dossiers d'expérience
    ui/                    SectionHeading, ContactForm, FictionalNotice, KnowHowSection, NextExperience…
  content/                 experiences.ts, services.ts, site-config.ts, media-plan.json, media-manifest.ts
                           + contenus fictifs par expérience (portfolio, restaurant, real-estate, automotive, saas, fitness)
  lib/                     scroll-progress.ts, motion-mode.ts, media-loader.ts, preview-controller.ts, utils.ts
public/media/<01..08>/     posters, previews, séquences, stills
scripts/                   generate-placeholder-media.mjs
tests/                     suites Playwright
```

## Moteur de scroll réversible

- `ScrollChapter` : section de 260–420 svh avec média `sticky` de 100 svh. La progression 0..1 est calculée
  depuis la position de la section, dans un seul `requestAnimationFrame` partagé, et recalculée au resize,
  à la rotation, après chargement des polices et après restauration de session (`pageshow`).
- Aucun `preventDefault`, scroll-lock, faux scroll ou snap obligatoire : molette, trackpad, scrollbar,
  clavier et toucher restent natifs.
- `SequenceCanvas` : `frameIndex = Math.round(progress * (frameCount - 1))`. Poster dessiné immédiatement,
  première/dernière frames et frames proches en priorité, `createImageBitmap` avec fallback `Image`, DPR
  plafonné à 2 (desktop) / 1,5 (mobile), suspension hors écran, bascule desktop/mobile sans flash, dernière
  frame décodée conservée pendant le chargement.
- Chaque chapitre expose un lien **« Passer l’animation »**.

### Modes de mouvement

| Mode | Déclencheur | Comportement |
| --- | --- | --- |
| `full` | défaut | séquences complètes, previews vidéo |
| `lite` | `Save-Data`, connexion lente, mémoire ≤ 2 Go | une frame sur deux, DPR 1, previews désactivées |
| `static` | `prefers-reduced-motion`, JavaScript désactivé, choix utilisateur (pied de page), échecs de décodage répétés | posters, texte et CTA uniquement |

Le mode est fixé avant l'hydratation par un script inline (`data-motion` sur `<html>`).

## Médias

Le MCP Higgsfield n'était pas disponible : le site est livré avec des **médias de substitution
procéduraux** (SVG → WebP, previews WebM), générés par :

```bash
npm run media:placeholders            # toutes les expériences
node scripts/generate-placeholder-media.mjs --only=automotive --no-video
```

- `MEDIA_NEEDED.md` : prompts, formats, chemins et contraintes des films à produire avec Seedance 2.0.
- `MEDIA_MANIFEST.md` : statut, poids et chemins de chaque média.

### Remplacer un média sans toucher aux composants

1. Déposer les exports dans `public/media/<dossier>/` en respectant la convention de nommage
   (`poster.webp`, `poster-mobile.webp`, `preview.webm`/`preview.mp4`, `seq/<version>/desktop|mobile/NNN.webp`,
   `stills/<id>.webp`).
2. Mettre à jour `src/content/media-plan.json` (`version`, `frames`, `status`).
3. Lancer `npm run verify`.

Les noms de dossiers de séquences sont versionnés (`seq/v1`, `seq/v2`…) et servis avec `Cache-Control: immutable`.

## Contenu et configuration

- `src/content/site-config.ts` : nom, URL, coordonnées (e-mail, téléphone, WhatsApp, adresse), réseaux,
  preuves (chiffres, clients, témoignages) et informations légales. **Toute valeur vide est masquée** ;
  aucune preuve n'est fabriquée.
- `src/content/experiences.ts` : les huit expériences (textes, accents, prompts, savoir-faire, métadonnées).
- `src/content/portfolio.ts` : contenu de la démo de portfolio (statistiques et liens sociaux : uniquement des données réelles).
- Logo : aucun logo n'existait dans le dépôt ; le wordmark HTML `MV DESIGN` (`components/layout/Wordmark.tsx`)
  est à remplacer par le logo fourni sans le redessiner.

## Formulaire de contact

`POST /api/contact` : validation client et serveur, honeypot, délai anti-automate, limitation de requêtes
par IP (mémoire, configurable via `CONTACT_RATE_LIMIT_*`). Envoi via Resend si `RESEND_API_KEY` et
`CONTACT_TO_EMAIL` sont définis ; sinon l'API **ne simule pas un succès** : elle renvoie un fallback `mailto:`
clairement annoncé à l'utilisateur (ou un message indiquant que l'envoi n'est pas configuré si aucune adresse n'existe).

## SEO et sécurité

Métadonnées uniques par page, canonical, Open Graph (image générée), sitemap, robots, données structurées
`ProfessionalService` (layout) et `CreativeWork` (expériences). En-têtes de sécurité (CSP, HSTS, nosniff,
frame-ancestors, permissions) dans `next.config.ts`. Analytics chargées uniquement après consentement et
seulement si `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` est défini.

## Tests

```bash
npm run test                          # tous les navigateurs configurés (Chromium, Firefox, WebKit) × 4 viewports
PW_BROWSERS=chromium npm run test     # uniquement Chromium
PW_DEV=1 npm run test                 # contre le serveur de développement
```

Viewports : 1440×900, 1024×768, 768×1024, 390×844 (mobile tactile). Les suites vérifient : accueil (8 cartes,
ordre, une seule preview en lecture, hero réversible), les 8 pages projet (H1 unique, mention fictive,
savoir-faire, progression avant/arrière, saut de scrollbar, rechargement en milieu de scène, canvas non
vide, clavier), mode mouvement réduit, fallback média manquant, rotation, pages éditoriales, formulaire,
API, en-têtes, sitemap et accessibilité de base. Installer Firefox et WebKit avec `npx playwright install firefox webkit`. Si `playwright install` est interdit,
`PW_CHROMIUM_EXECUTABLE=/chemin/vers/chrome` pointe vers un Chromium existant (auto-détection de `/opt/pw-browsers/chromium`).

## Déploiement

Build Node standard (`npm run build && npm run start`) ou plateforme compatible Next.js (Vercel, Netlify,
conteneur Node). Définir `NEXT_PUBLIC_SITE_URL` pour les canonicals et le sitemap, puis les variables du
formulaire. Les médias sont servis depuis `public/media` avec cache immutable : versionner les dossiers de
séquences à chaque remplacement.
