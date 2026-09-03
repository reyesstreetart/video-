/**
 * Les huit expériences MV Design, dans l'ordre imposé.
 * Chaque univers est un concept expérimental : marques, produits, prix et chiffres sont fictifs.
 */
export const experienceSlugs = [
  "deep-sea-journey",
  "personal-portfolio",
  "luxury-product",
  "restaurant",
  "real-estate",
  "automotive",
  "saas",
  "fitness",
] as const;

export type ExperienceSlug = (typeof experienceSlugs)[number];

export interface MediaPrompt {
  id: string;
  name: string;
  brief: string;
  prompt: string;
  /** Plan chaîné : la dernière frame du plan précédent sert de start frame. */
  chained?: boolean;
}

export interface Experience {
  slug: ExperienceSlug;
  number: string;
  folder: string;
  sector: string;
  concept: string;
  brand: string;
  hook: string;
  summary: string;
  indexTitle: string;
  interaction: string;
  accent: string;
  accentSoft: string;
  paletteNote: string;
  fictional: boolean;
  fictionalNote: string;
  knowHow: { title: string; text: string }[];
  metaTitle: string;
  metaDescription: string;
  masterImage?: string;
  continuityPrompt?: string;
  media: MediaPrompt[];
}

export const experiences: Experience[] = [
  {
    slug: "deep-sea-journey",
    number: "01",
    folder: "01-deep-sea",
    sector: "Expérience et storytelling",
    concept: "Descente sous-marine",
    brand: "ABYSSAL",
    hook: "Jusqu’où irez-vous ?",
    indexTitle: "Transformer le scroll en voyage.",
    summary: "Une descente continue de la surface jusqu’à 3 800 mètres de profondeur.",
    interaction: "Le scroll vers le bas plonge, le scroll inverse remonte vers la surface. Un HUD fixe suit la profondeur de 0 à 3 800 m.",
    accent: "#3DE8FF",
    accentSoft: "rgba(61, 232, 255, 0.16)",
    paletteNote: "Bleu profond vers noir, cyan bioluminescent.",
    fictional: true,
    fictionalNote: "ABYSSAL, le submersible EREBUS, le tarif et la date de départ sont entièrement fictifs.",
    knowHow: [
      { title: "Narration continue", text: "Cinq clips chaînés par leurs frames de début et de fin pour former un seul voyage sans coupure." },
      { title: "Scroll réversible", text: "Progression strictement liée au scroll natif : plonger, remonter, sauter avec la scrollbar sans jamais bloquer la page." },
      { title: "HUD synchronisé", text: "Profondeur, zone et faits marquants calculés depuis la même progression que l’image." },
    ],
    metaTitle: "Descente sous-marine · Expérience storytelling ABYSSAL",
    metaDescription: "Concept expérimental MV Design : une descente sous-marine continue pilotée par le scroll, de la surface jusqu’à 3 800 mètres de profondeur.",
    masterImage: "EREBUS : coque noire profilée, anneau cyan autour du hublot, deux projecteurs. Même référence sur chaque génération.",
    continuityPrompt:
      "One seamless stabilized deep-sea descent featuring the exact same EREBUS submersible in every frame, consistent sleek black hull, cyan viewport ring and twin floodlights, progressive loss of sunlight from the ocean surface to the abyssal floor, physically plausible water and creatures, no camera cut inside each clip, no text, no logo, no geometry change, clean matching start and end frames.",
    media: [
      { id: "surface", name: "The Surface", brief: "Océan à l’aube, le submersible passe sous la surface et termine entièrement immergé.", prompt: "Dawn ocean surface, the EREBUS submersible slips under the waterline and ends fully submerged.", chained: true },
      { id: "sunlit", name: "Sunlit Zone", brief: "Descente dans les rayons et les colonnes de bulles, silhouette de baleine au loin.", prompt: "Descent through sun rays and bubble columns, distant whale silhouette.", chained: true },
      { id: "twilight", name: "Twilight Zone", brief: "La lumière disparaît, méduses fantomatiques, projecteurs qui s’allument.", prompt: "Light fades, ghostly jellyfish, twin floodlights switch on.", chained: true },
      { id: "midnight", name: "Midnight Zone", brief: "Obscurité totale et organismes bioluminescents autour de la coque.", prompt: "Total darkness, bioluminescent organisms drifting around the hull.", chained: true },
      { id: "floor", name: "The Floor", brief: "Les projecteurs révèlent des sources hydrothermales sur le fond océanique.", prompt: "Floodlights reveal hydrothermal vents on the ocean floor.", chained: true },
    ],
  },
  {
    slug: "personal-portfolio",
    number: "02",
    folder: "02-personal-portfolio",
    sector: "Portfolio personnel",
    concept: "Créateur ou dirigeant",
    brand: "PORTFOLIO",
    hook: "Faire de la personne le récit.",
    indexTitle: "Faire de la personne le récit.",
    summary: "Identité, présence et réalisations se révèlent autour d’un portrait central.",
    interaction: "Une orbite à 360° commandée par le scroll autour de la personne, un nom monumental qui entre lettre par lettre.",
    accent: "#4C7DFF",
    accentSoft: "rgba(76, 125, 255, 0.16)",
    paletteNote: "Studio noir, lumière de contour bleu roi.",
    fictional: true,
    fictionalNote: "Démonstration de portfolio. Aucune photo n’a été fournie : la personne est une silhouette conceptuelle, sans visage inventé. Les chiffres et projets sont des exemples de contenu.",
    knowHow: [
      { title: "Identité préservée", text: "Une seule référence d’identité consentie transmise à chaque génération, ou une silhouette conceptuelle si aucune photo n’est fournie." },
      { title: "Orbite scrubée", text: "Rotation à 360° rendue en séquence d’images, réversible et sans moteur 3D." },
      { title: "Contenu configurable", text: "Nom, activité, statistiques, offres, projets et liens vivent dans un fichier de contenu. Rien n’est inventé." },
    ],
    metaTitle: "Portfolio personnel · Créateur ou dirigeant",
    metaDescription: "Concept expérimental MV Design : un portfolio personnel où la personne devient le récit, orbite scrubée, offres et projets révélés au scroll.",
    continuityPrompt:
      "Cinematic personal-brand film using the supplied consenting identity reference on every shot, exact same face, hairstyle and wardrobe, confident but natural posture, dark editorial studio, royal-blue rim light, slow stabilized camera, no text, no facial morphing, no identity drift, no logo, stable first and final frames.",
    media: [
      { id: "orbit", name: "Hero Orbit", brief: "Personne debout, bras croisés, studio noir, lumière de contour bleu roi, caméra en orbite lente à 360°.", prompt: "Person standing, arms crossed, black studio, royal-blue rim light, slow 360° camera orbit." },
      { id: "builder", name: "The Builder", brief: "Personne à un bureau sombre entourée d’écrans présentant son travail.", prompt: "Person at a dark desk surrounded by screens showing their work." },
      { id: "closer", name: "The Closer", brief: "Personne avançant dans une galerie bordée d’écrans, puis s’arrêtant face caméra.", prompt: "Person walking through a gallery lined with screens, stopping to face camera." },
    ],
  },
  {
    slug: "luxury-product",
    number: "03",
    folder: "03-luxury-product",
    sector: "Produit de luxe",
    concept: "Montre tourbillon Eclipse",
    brand: "AURUM & NOIR",
    hook: "Crafted in Darkness.",
    indexTitle: "Révéler l’invisible.",
    summary: "Une montre tourne, dévoile sa mécanique, se décompose puis se recompose au rythme du scroll.",
    interaction: "Le scroll fait tourner la montre, le scroll inverse la fait tourner en sens inverse. Macro scrubée puis vue éclatée avec callouts.",
    accent: "#C8A96B",
    accentSoft: "rgba(200, 169, 107, 0.16)",
    paletteNote: "Noir profond, or champagne, blanc ivoire.",
    fictional: true,
    fictionalNote: "AURUM & NOIR, la montre Eclipse, ses caractéristiques, l’édition et le prix sont fictifs.",
    knowHow: [
      { title: "Séquence canvas", text: "Orbite studio convertie en séquence d’images décodée dans un canvas, DPR plafonné et cache libéré hors écran." },
      { title: "Typographie animée", text: "Nom de marque massif avec tracking piloté par la progression, jamais illisible." },
      { title: "Vue éclatée", text: "Composants séparés selon des axes plausibles puis réassemblés, callouts techniques ancrés au bon moment." },
    ],
    metaTitle: "Produit de luxe · Montre tourbillon Eclipse",
    metaDescription: "Concept expérimental MV Design : un film produit ultra-luxe où la montre tourne, se dévoile en macro et s’éclate au rythme du scroll.",
    masterImage: "Boîtier titane noir brossé, tourbillon or visible sous verre saphir, proportions réalistes.",
    continuityPrompt:
      "Ultra-luxury product film of the exact reference watch, brushed black titanium case, champagne-gold tourbillon visible through sapphire glass, perfectly consistent geometry, slow controlled camera, black studio void, precise rim lighting, no text, no logo, no duplicated parts, no morphing, no flicker, stable first and final frames.",
    media: [
      { id: "orbit", name: "Hero Orbit", brief: "Rotation studio parfaitement fluide à 360°, montre flottant dans un vide noir, lumière de contour et poussière dorée légère.", prompt: "Perfectly smooth 360° studio rotation, watch floating in black void, rim light, faint gold dust." },
      { id: "macro", name: "Macro Fly-through", brief: "Travelling macro sur le cadran, les index, le tourbillon et le métal brossé.", prompt: "Macro fly-through over dial, indices, tourbillon and brushed metal." },
      { id: "exploded", name: "Exploded Assembly", brief: "Composants mécaniques se séparant selon des axes plausibles, suspension élégante, puis réassemblage complet.", prompt: "Mechanical components separating along plausible axes, elegant suspension, full reassembly." },
    ],
  },
  {
    slug: "restaurant",
    number: "04",
    folder: "04-restaurant",
    sector: "Restaurant",
    concept: "Feu et gastronomie",
    brand: "EMBER & OAK",
    hook: "Wood fire. Nothing else.",
    indexTitle: "Donner envie avant la réservation.",
    summary: "Le feu, le geste et le service deviennent une expérience sensorielle.",
    interaction: "Un hero de feu scrubé, un menu éditorial Feu / Terre et un formulaire de réservation date et couverts.",
    accent: "#FF7A2F",
    accentSoft: "rgba(255, 122, 47, 0.16)",
    paletteNote: "Noir, crème chaud, orange braise.",
    fictional: true,
    fictionalNote: "EMBER & OAK, sa carte, ses horaires et son adresse sont fictifs.",
    knowHow: [
      { title: "Matière et rythme", text: "Macro slow motion scrubée pour que la flamme réponde au geste du visiteur." },
      { title: "Menu éditorial", text: "Deux colonnes Feu / Terre sur desktop, une colonne sur mobile, typographie serif et filets or." },
      { title: "Conversion", text: "Formulaire de réservation accessible, validation, honeypot et fallback mailto annoncé." },
    ],
    metaTitle: "Restaurant · Steakhouse au feu de bois EMBER & OAK",
    metaDescription: "Concept expérimental MV Design : un site de restaurant où le feu, le geste et la salle donnent envie avant la réservation.",
    continuityPrompt:
      "High-end wood-fire restaurant film, cinematic macro textures, controlled open flame, rising embers, warm amber light, realistic food and chef gestures, elegant moody dining room, slow stabilized camera, no text, no logo, no excessive fire, no deformed hands, no flicker.",
    media: [
      { id: "fire", name: "Hero", brief: "Macro slow motion d’une pièce de viande saisie sur flamme ouverte, braises dans l’obscurité.", prompt: "Slow-motion macro of meat searing over open flame, embers in darkness." },
      { id: "room", name: "The Room", brief: "Travelling lent dans une salle chaleureuse, cuir, bougies, bar en arrière-plan.", prompt: "Slow dolly through a warm dining room, leather, candles, bar in background." },
      { id: "craft", name: "The Craft", brief: "Mains du chef dressant une assiette, vapeur et table d’ardoise.", prompt: "Chef hands plating a dish, steam, slate table." },
    ],
  },
  {
    slug: "real-estate",
    number: "05",
    folder: "05-real-estate",
    sector: "Immobilier",
    concept: "Penthouse de luxe",
    brand: "THE MERIDIAN",
    hook: "Soixante étages au-dessus de tout.",
    indexTitle: "Faire visiter avant la visite.",
    summary: "Le scroll conduit l’acheteur de la ville jusqu’au cœur du penthouse.",
    interaction: "Le scroll fait avancer ou reculer la visite : Approche · Arrivée · Séjour · Suite · Terrasse.",
    accent: "#D8B778",
    accentSoft: "rgba(216, 183, 120, 0.16)",
    paletteNote: "Noir encre, or champagne, ivoire.",
    fictional: true,
    fictionalNote: "THE MERIDIAN n’existe pas et n’est pas à vendre. Surfaces, équipements et prix sont fictifs.",
    knowHow: [
      { title: "Visite chaînée", text: "Quatre plans reliés par leurs frames de début et de fin pour une progression continue de la ville à la terrasse." },
      { title: "Progression fixe", text: "Un indicateur d’étapes synchronisé qui reste lisible dans les deux sens." },
      { title: "Conversion qualifiée", text: "Facts strip, galerie, équipements et formulaire de visite privée." },
    ],
    metaTitle: "Immobilier · Penthouse THE MERIDIAN",
    metaDescription: "Concept expérimental MV Design : une visite immobilière continue pilotée par le scroll, de la ville jusqu’à la terrasse du penthouse.",
    masterImage: "Tour au crépuscule, façade vitrée, lumières de ville en contrebas.",
    continuityPrompt:
      "Seamless cinematic tour of the exact same luxury penthouse and tower, perfectly consistent architecture, furniture, marble and city orientation, stabilized forward camera movement, dusk progressing naturally into night, clean matched start and end frames, no text, no logo, no geometry morphing, no impossible rooms.",
    media: [
      { id: "approach", name: "The Approach", brief: "Drone tournant autour de la tour, lumières de ville qui s’allument.", prompt: "Drone orbiting the tower, city lights switching on." },
      { id: "arrival", name: "The Arrival", brief: "Caméra depuis l’ascenseur privé jusqu’au séjour vitré.", prompt: "Camera from private elevator into glazed living room.", chained: true },
      { id: "flow", name: "The Flow", brief: "Traversée de la cuisine et de la suite vers la terrasse.", prompt: "Flow through kitchen and master suite toward terrace.", chained: true },
      { id: "terrace", name: "The Terrace", brief: "Piscine à débordement et skyline de nuit.", prompt: "Infinity pool and night skyline.", chained: true },
    ],
  },
  {
    slug: "automotive",
    number: "06",
    folder: "06-automotive",
    sector: "Automobile",
    concept: "Hypercar électrique",
    brand: "VANTA",
    hook: "1 200 ch. Zéro bruit.",
    indexTitle: "Faire ressentir la performance.",
    summary: "La route, la vitesse et la lumière réagissent à chaque mouvement du visiteur.",
    interaction: "Le scroll conduit la voiture à travers quatre environnements avec un HUD synchronisé de 0 à 250 mph.",
    accent: "#37E6FF",
    accentSoft: "rgba(55, 230, 255, 0.14)",
    paletteNote: "Noir sur noir, cyan électrique.",
    fictional: true,
    fictionalNote: "VANTA, l’hypercar, ses performances, ses couleurs et le dépôt de réservation sont fictifs.",
    knowHow: [
      { title: "Parcours continu", text: "Quatre plans chaînés du désert blanc aux dunes nocturnes, sans coupure perceptible." },
      { title: "HUD réactif", text: "Vitesse, compteurs et mode nuit calculés depuis la progression du scroll." },
      { title: "Configurateur", text: "Trois teintes appliquées sur une image cohérente, sans rendu 3D." },
    ],
    metaTitle: "Automobile · Hypercar électrique VANTA",
    metaDescription: "Concept expérimental MV Design : une hypercar électrique conduite par le scroll à travers désert, canyon et nuit, HUD synchronisé de 0 à 250 mph.",
    masterImage: "Voiture très basse et large, carrosserie obsidienne mate, signature lumineuse fine.",
    continuityPrompt:
      "Cinematic performance drive with the exact same VANTA hypercar in every shot, low wide matte-obsidian body, thin light-bar face, consistent wheels and proportions, realistic suspension and tire contact, stabilized dynamic camera, continuous terrain journey, no text, no logo, no body morphing, no duplicated car.",
    media: [
      { id: "reveal", name: "Reveal", brief: "Poussière retombant sur un désert blanc, signature lumineuse qui s’allume.", prompt: "Dust settling on a white desert, light signature switching on." },
      { id: "run", name: "The Run", brief: "Tracking bas lors du départ sur les plaines.", prompt: "Low tracking shot on launch across the plains.", chained: true },
      { id: "canyon", name: "The Canyon", brief: "Traversée rapide d’un canyon rouge.", prompt: "Fast run through a red canyon.", chained: true },
      { id: "night", name: "Night Mode", brief: "Dunes nocturnes, traînées de lumière sous les étoiles.", prompt: "Night dunes, light trails under stars.", chained: true },
    ],
  },
  {
    slug: "saas",
    number: "07",
    folder: "07-saas",
    sector: "SaaS",
    concept: "Plateforme d’analyse IA",
    brand: "PULSE",
    hook: "Voyez le départ avant qu’il n’arrive.",
    indexTitle: "Rendre une technologie visible.",
    summary: "Les données s’assemblent pour révéler une interface claire et crédible.",
    interaction: "Le dashboard se construit avec le scroll, puis trois fonctions se révèlent : Prédire · Expliquer · Prévenir.",
    accent: "#8B5CF6",
    accentSoft: "rgba(139, 92, 246, 0.16)",
    paletteNote: "Hero presque noir, corps clair, accent violet.",
    fictional: true,
    fictionalNote: "PULSE, ses métriques, ses tarifs et ses clients sont des données de démonstration.",
    knowHow: [
      { title: "Interface réelle", text: "Le screenshot est un vrai composant HTML/CSS dans un browser mockup, jamais un texte généré illisible." },
      { title: "Construction progressive", text: "Particules puis interface : le dashboard s’assemble et se désassemble avec le scroll." },
      { title: "Crédibilité", text: "Métriques de démonstration signalées, tarifs clairs, FAQ indexable." },
    ],
    metaTitle: "SaaS · Plateforme d’analyse IA PULSE",
    metaDescription: "Concept expérimental MV Design : un site SaaS où les données s’assemblent au scroll pour révéler une interface claire, crédible et indexable.",
    continuityPrompt:
      "Premium AI analytics product film, thousands of controlled data particles assembling into one coherent floating dashboard, clean geometric interface, a rising graph pulsing like a heartbeat, dark void evolving into a bright minimal office, no readable generated text, no broken UI, no random symbols, stable camera and geometry.",
    media: [
      { id: "particles", name: "Hero", brief: "Particules de données s’assemblant en interface flottante avec graphique pulsant.", prompt: "Data particles assembling into a floating interface with a pulsing graph." },
      { id: "signal", name: "The Signal", brief: "Travelling macro sur graphiques holographiques, anomalie rouge détectée.", prompt: "Macro dolly across holographic charts, red anomaly detected." },
      { id: "calm", name: "The Calm", brief: "Dashboard sur ordinateur dans un bureau minimal lumineux.", prompt: "Dashboard on a laptop in a bright minimal office." },
    ],
  },
  {
    slug: "fitness",
    number: "08",
    folder: "08-fitness",
    sector: "Fitness",
    concept: "Salle de sport premium",
    brand: "FORGE",
    hook: "Earn it.",
    indexTitle: "Transformer l’effort en énergie.",
    summary: "Matière, mouvement et intensité construisent une identité forte.",
    interaction: "Un nuage de magnésie scrubé derrière FORGE en typographie industrielle, une philosophie révélée ligne par ligne.",
    accent: "#E23B3B",
    accentSoft: "rgba(226, 59, 59, 0.14)",
    paletteNote: "Charbon, blanc os, rouge sang utilisé avec retenue.",
    fictional: true,
    fictionalNote: "FORGE, ses coachs, ses tarifs, son planning et ses résultats sont des données de démonstration. Les profils de coachs sont conceptuels.",
    knowHow: [
      { title: "Matière scrubée", text: "Le nuage de magnésie se déploie et se rétracte avec le scroll sous un faisceau vertical." },
      { title: "Typographie industrielle", text: "Un logotype massif, du grain contrôlé et un rouge utilisé seulement pour l’accent." },
      { title: "Mobile d’abord", text: "Cartes programmes glissables sans overflow horizontal de la page, boutons de 44 px minimum." },
    ],
    metaTitle: "Fitness · Salle de sport premium FORGE",
    metaDescription: "Concept expérimental MV Design : une salle de sport premium où matière, mouvement et intensité construisent une identité forte.",
    continuityPrompt:
      "Cinematic premium strength-gym film, athlete clapping chalked hands in a dark gym, chalk cloud blooming through one overhead shaft of light, macro tracking along a loaded barbell, realistic hands and metal, runner sprinting at dawn, controlled grain, no text, no logo, no distorted anatomy, no flicker.",
    media: [
      { id: "chalk", name: "Hero", brief: "Athlète frappant ses mains couvertes de magnésie sous un faisceau vertical.", prompt: "Athlete clapping chalked hands under a vertical shaft of light." },
      { id: "iron", name: "The Iron", brief: "Travelling macro le long d’une barre chargée, mains et texture du grip.", prompt: "Macro tracking along a loaded barbell, hands and knurling texture." },
      { id: "grind", name: "The Grind", brief: "Coureur sprintant sur une piste à l’aube.", prompt: "Runner sprinting on a track at dawn." },
    ],
  },
];

export const experienceBySlug = (slug: string): Experience | undefined =>
  experiences.find((e) => e.slug === slug);

export const nextExperience = (slug: ExperienceSlug): Experience => {
  const i = experiences.findIndex((e) => e.slug === slug);
  const next = experiences[(i + 1) % experiences.length];
  if (!next) throw new Error("experiences list is empty");
  return next;
};

export const FICTIONAL_LABEL = "Concept expérimental MV Design";
