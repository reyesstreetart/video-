# MEDIA_NEEDED — cahier de production des médias (Higgsfield / Seedance 2.0)

> **Statut : produit.** Les 8 images maîtresses, 23 frames-clés et stills, et 36 clips Seedance 2.0
> (8 héros desktop 16:9, 8 variantes mobiles 9:16, 20 plans chaînés et scènes secondaires) ont été générés
> avec le MCP Higgsfield puis importés par `scripts/import-media.mjs` (workflow `import-media.yml`).
> Les URL sources sont dans `src/content/media-sources.json`. Ce document reste la référence pour
> régénérer ou remplacer un plan **sans modifier les composants**.

Méthode de continuité utilisée : image maîtresse → frames-clés dérivées avec la maîtresse en
`image_references` → clips générés avec `start_image` = frame-clé N et `end_image` = frame-clé N+1,
ce qui garantit des raccords exacts entre plans chaînés.

## Règles communes

- Seedance 2.0, mode standard, 1080p minimum, sans audio.
- Clips de 8 à 10 s sauf nécessité narrative ; master desktop 16:9 ; variante mobile 9:16 (ou 4:5).
- Sujet dans la zone centrale protégée (les overlays texte occupent le bas gauche/droite).
- **Image maîtresse avant toute vidéo**, réutilisée comme référence sur tous les plans d'un univers.
- Parcours continus : dernière frame du clip N = start frame du clip N+1.
- Aucun texte, logo, sous-titre ou interface lisible dans les films.
- Première et dernière frames propres et stables ; pas de morphing, dédoublement, scintillement.
- Mouvements lisibles en marche avant **et** arrière (scroll réversible).
- Générer 2 ou 3 variantes si la cohérence n'est pas suffisante.

## Exports attendus (par expérience)

| Fichier | Rôle | Contraintes |
| --- | --- | --- |
| `poster.webp` (1280×720) / `poster-mobile.webp` (540×960) | Carte d'accueil, poster du hero, OG image | < 250 Ko mobile, AVIF/WebP |
| `preview.webm` (+ `preview.mp4` H.264 faststart) | Preview d'accueil, 3–5 s, muette | < 1,5 Mo |
| `seq/<version>/desktop/NNN.webp` | Séquence hero scrubée 16:9, 12–15 i/s | idéalement < 12 Mo par scène |
| `seq/<version>/mobile/NNN.webp` | Séquence hero 9:16 | idéalement < 6 Mo par scène |
| `stills/<id>.webp` / `stills/<id>-mobile.webp` | Posters des scènes secondaires | — |
| `hero.webm` / `hero.mp4` (optionnel) | Alternative vidéo si la séquence n'est pas fournie | faststart |

Pour activer une nouvelle version : déposer les fichiers, puis mettre à jour `src/content/media-plan.json`
(`version`, `frames`, `status: "generated"`). Le manifeste typé `src/content/media-manifest.ts` se
reconstruit automatiquement à partir de ce plan. Voir `MEDIA_MANIFEST.md`.

---

## 01 · Descente sous-marine — ABYSSAL / EREBUS

Dossier : `public/media/01-deep-sea/` · Séquence hero : 72 frames (5 clips chaînés concaténés) · Scroll : 420 svh

**Image maîtresse** : EREBUS, coque noire profilée, anneau cyan autour du hublot, deux projecteurs.

**Prompt de continuité** :
`One seamless stabilized deep-sea descent featuring the exact same EREBUS submersible in every frame, consistent sleek black hull, cyan viewport ring and twin floodlights, progressive loss of sunlight from the ocean surface to the abyssal floor, physically plausible water and creatures, no camera cut inside each clip, no text, no logo, no geometry change, clean matching start and end frames.`

| # | Clip | Brief | Still |
| --- | --- | --- | --- |
| 1 | The Surface | Océan à l'aube, le submersible passe sous la surface et termine entièrement immergé. | `stills/surface.webp` |
| 2 | Sunlit Zone | Descente dans les rayons et les colonnes de bulles, silhouette de baleine au loin. | `stills/sunlit.webp` |
| 3 | Twilight Zone | La lumière disparaît, méduses fantomatiques, projecteurs qui s'allument. | `stills/twilight.webp` |
| 4 | Midnight Zone | Obscurité totale et organismes bioluminescents autour de la coque. | `stills/midnight.webp` |
| 5 | The Floor | Les projecteurs révèlent des sources hydrothermales sur le fond océanique. | `stills/floor.webp` |

Chaîner 1→5 par les frames de fin/début, puis exporter la concaténation en séquence d'images (12–15 i/s).

## 02 · Portfolio personnel

Dossier : `public/media/02-personal-portfolio/` · Séquence hero : 48 frames (orbite 360°) · Scroll : 320 svh

**Identité** : si une photo frontale consentie est fournie, la transmettre comme référence sur chaque génération
(même visage, coiffure, tenue). Sinon, conserver une silhouette conceptuelle ou un personnage fictif clairement identifié.
Ne jamais inventer le visage du propriétaire de MV Design.

**Prompt de base** :
`Cinematic personal-brand film using the supplied consenting identity reference on every shot, exact same face, hairstyle and wardrobe, confident but natural posture, dark editorial studio, royal-blue rim light, slow stabilized camera, no text, no facial morphing, no identity drift, no logo, stable first and final frames.`

| # | Clip | Brief | Fichier |
| --- | --- | --- | --- |
| 1 | Hero Orbit | Personne debout, bras croisés, studio noir, lumière de contour bleu roi, caméra en orbite lente à 360°. | `seq/…` + `stills/orbit.webp` |
| 2 | The Builder | Personne à un bureau sombre entourée d'écrans présentant son travail. | `stills/builder.webp` (+ `hero-builder.webm` optionnel) |
| 3 | The Closer | Personne avançant dans une galerie bordée d'écrans, puis s'arrêtant face caméra. | `stills/closer.webp` |

## 03 · Produit de luxe — AURUM & NOIR / Eclipse

Dossier : `public/media/03-luxury-product/` · Séquence hero : 48 frames (rotation 360°) · Scroll : 340 svh

**Image maîtresse** : boîtier titane noir brossé, tourbillon or visible sous verre saphir, proportions réalistes.

**Prompt de base** :
`Ultra-luxury product film of the exact reference watch, brushed black titanium case, champagne-gold tourbillon visible through sapphire glass, perfectly consistent geometry, slow controlled camera, black studio void, precise rim lighting, no text, no logo, no duplicated parts, no morphing, no flicker, stable first and final frames.`

| # | Clip | Brief | Fichier |
| --- | --- | --- | --- |
| 1 | Hero Orbit | Rotation studio parfaitement fluide à 360°, montre flottant dans un vide noir, lumière de contour, poussière dorée légère. | `seq/…` |
| 2 | Macro Fly-through | Travelling macro sur le cadran, les index, le tourbillon et le métal brossé. | `stills/macro.webp` (scrub CSS) |
| 3 | Exploded Assembly | Composants se séparant selon des axes plausibles, suspension élégante, puis réassemblage complet. | `stills/exploded.webp` — la vue éclatée est actuellement un SVG piloté par le scroll |

## 04 · Restaurant — EMBER & OAK

Dossier : `public/media/04-restaurant/` · Séquence hero : 36 frames · Scroll : 280 svh

**Prompt de base** :
`High-end wood-fire restaurant film, cinematic macro textures, controlled open flame, rising embers, warm amber light, realistic food and chef gestures, elegant moody dining room, slow stabilized camera, no text, no logo, no excessive fire, no deformed hands, no flicker.`

| # | Clip | Brief | Fichier |
| --- | --- | --- | --- |
| 1 | Hero | Macro slow motion d'une pièce de viande saisie sur flamme ouverte, braises dans l'obscurité. | `seq/…` + `stills/fire.webp` |
| 2 | The Room | Travelling lent dans une salle chaleureuse, cuir, bougies, bar en arrière-plan. | `stills/room.webp` |
| 3 | The Craft | Mains du chef dressant une assiette, vapeur et table d'ardoise. | `stills/craft.webp` |

## 05 · Immobilier — THE MERIDIAN

Dossier : `public/media/05-real-estate/` · Séquence hero : 60 frames (4 clips chaînés) · Scroll : 400 svh

**Image maîtresse** : tour au crépuscule. Chaîner les plans 2 à 4 par leurs frames de début et de fin.

**Prompt de continuité** :
`Seamless cinematic tour of the exact same luxury penthouse and tower, perfectly consistent architecture, furniture, marble and city orientation, stabilized forward camera movement, dusk progressing naturally into night, clean matched start and end frames, no text, no logo, no geometry morphing, no impossible rooms.`

| # | Clip | Brief | Still |
| --- | --- | --- | --- |
| 1 | The Approach | Drone tournant autour de la tour, lumières de ville qui s'allument. | `stills/approach.webp` |
| 2 | The Arrival | Caméra depuis l'ascenseur privé jusqu'au séjour vitré. | `stills/arrival.webp` |
| 3 | The Flow | Traversée de la cuisine et de la suite vers la terrasse. | `stills/flow.webp` |
| 4 | The Terrace | Piscine à débordement et skyline de nuit. | `stills/terrace.webp` |

## 06 · Automobile — VANTA

Dossier : `public/media/06-automotive/` · Séquence hero : 60 frames (4 clips chaînés) · Scroll : 400 svh

**Image maîtresse** : voiture très basse et large, carrosserie obsidienne mate, signature lumineuse fine.

**Prompt de continuité** :
`Cinematic performance drive with the exact same VANTA hypercar in every shot, low wide matte-obsidian body, thin light-bar face, consistent wheels and proportions, realistic suspension and tire contact, stabilized dynamic camera, continuous terrain journey, no text, no logo, no body morphing, no duplicated car.`

| # | Clip | Brief | Still |
| --- | --- | --- | --- |
| 1 | Reveal | Poussière retombant sur un désert blanc, signature lumineuse qui s'allume. | `stills/reveal.webp` (sert aussi au configurateur) |
| 2 | The Run | Tracking bas lors du départ sur les plaines. | `stills/run.webp` |
| 3 | The Canyon | Traversée rapide d'un canyon rouge. | `stills/canyon.webp` |
| 4 | Night Mode | Dunes nocturnes, traînées de lumière sous les étoiles. | `stills/night.webp` |

## 07 · SaaS — PULSE

Dossier : `public/media/07-saas/` · Séquence hero : 36 frames · Scroll : 300 svh

**Prompt de base** :
`Premium AI analytics product film, thousands of controlled data particles assembling into one coherent floating dashboard, clean geometric interface, a rising graph pulsing like a heartbeat, dark void evolving into a bright minimal office, no readable generated text, no broken UI, no random symbols, stable camera and geometry.`

| # | Clip | Brief | Fichier |
| --- | --- | --- | --- |
| 1 | Hero | Particules de données s'assemblant en interface flottante avec graphique pulsant. | `seq/…` (le dashboard réel reste en HTML/CSS par-dessus) |
| 2 | The Signal | Travelling macro sur graphiques holographiques, anomalie rouge détectée. | `stills/signal.webp` |
| 3 | The Calm | Dashboard sur ordinateur dans un bureau minimal lumineux. | `stills/calm.webp` |

## 08 · Fitness — FORGE

Dossier : `public/media/08-fitness/` · Séquence hero : 36 frames · Scroll : 300 svh

**Prompt de base** :
`Cinematic premium strength-gym film, athlete clapping chalked hands in a dark gym, chalk cloud blooming through one overhead shaft of light, macro tracking along a loaded barbell, realistic hands and metal, runner sprinting at dawn, controlled grain, no text, no logo, no distorted anatomy, no flicker.`

| # | Clip | Brief | Fichier |
| --- | --- | --- | --- |
| 1 | Hero | Athlète frappant ses mains couvertes de magnésie sous un faisceau vertical. | `seq/…` |
| 2 | The Iron | Travelling macro le long d'une barre chargée, mains et texture du grip. | `stills/iron.webp` (scrub CSS) |
| 3 | The Grind | Coureur sprintant sur une piste à l'aube. | `stills/grind.webp` |

---

## Accueil — montage du monogramme

Le hero principal utilise les huit `poster.webp` en fondu enchaîné dans le masque « MV ». Aucun média
supplémentaire n'est requis ; un montage vidéo très court (< 1 Mo) peut remplacer le fondu CSS en
ajoutant une vidéo dans `HomeHero.tsx` si souhaité.
