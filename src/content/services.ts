export interface Service {
  id: string;
  title: string;
  description: string;
  details: string[];
}

export const expertiseIntro = {
  eyebrow: "EXPERTISE",
  title: "Une vision complète, de l’idée à la mise en ligne.",
  text: "Cinq disciplines réunies dans un même studio, pour qu’aucune intention ne se perde entre la stratégie, l’image et le code.",
};

export const services: Service[] = [
  {
    id: "strategie",
    title: "Stratégie & narration",
    description: "Positionnement, parcours, architecture éditoriale et storyboard.",
    details: [
      "Ateliers de positionnement et proposition de valeur",
      "Parcours utilisateur et architecture éditoriale",
      "Storyboard scène par scène du défilement",
      "Ton, vocabulaire et hiérarchie des messages",
    ],
  },
  {
    id: "direction-artistique",
    title: "Direction artistique",
    description: "Identité digitale, typographie, composition et système visuel.",
    details: [
      "Système visuel et grille de 12 colonnes",
      "Typographie éditoriale et interface",
      "Palette, matières, lumière et grain",
      "Maquettes desktop et mobile haute fidélité",
    ],
  },
  {
    id: "motion",
    title: "Motion & production visuelle",
    description: "Films cinématiques, animation produit, 3D et transitions.",
    details: [
      "Direction de films générés ou tournés, images maîtresses et continuité",
      "Séquences d’images pour héros pilotés par le scroll",
      "Animation produit, vues éclatées et macros",
      "Transitions par masque, opacité et déplacement",
    ],
  },
  {
    id: "developpement",
    title: "Développement créatif",
    description: "Scroll synchronisé, interactions avancées et responsive.",
    details: [
      "Next.js, React et TypeScript strict",
      "Moteur de scroll réversible sur scroll natif",
      "Canvas, séquences d’images et vidéos optimisées",
      "Modes full, lite et static selon l’appareil",
    ],
  },
  {
    id: "performance",
    title: "Performance & lancement",
    description: "Optimisation, SEO technique, recette multi-écrans et mise en production.",
    details: [
      "Budgets de poids et Core Web Vitals",
      "SEO technique, données structurées et métadonnées",
      "Recette Chromium, WebKit et Firefox sur quatre formats",
      "Déploiement, sécurité et suivi après mise en ligne",
    ],
  },
];

export const methodIntro = {
  eyebrow: "MÉTHODE",
  title: "Chaque mouvement commence par une intention.",
  text: "Cinq étapes, toujours dans le même ordre, pour transformer une ambition en expérience maîtrisée.",
};

export const methodSteps = [
  { number: "01", title: "Cadrer", text: "Comprendre la marque, le public et l’objectif." },
  { number: "02", title: "Écrire", text: "Transformer le message en parcours narratif." },
  { number: "03", title: "Produire", text: "Créer les images, films et matières." },
  { number: "04", title: "Développer", text: "Orchestrer contenu, mouvement et interaction." },
  { number: "05", title: "Éprouver", text: "Tester la lisibilité, la fluidité et la performance." },
];

export const studioIntro = {
  eyebrow: "STUDIO",
  title: "À la rencontre du design et de la technologie.",
  text: "MV Design est un studio web indépendant spécialisé dans les expériences digitales haut de gamme. Nous accompagnons les marques, architectes, établissements et créateurs qui souhaitent donner à leur savoir-faire une expression digitale à sa mesure.",
};

export const contactBlock = {
  title: "Mettons votre savoir-faire en mouvement.",
  text: "Parlez-nous de votre univers, de votre ambition et de l’expérience que vous souhaitez faire vivre.",
  primary: { href: "/contact", label: "Présenter mon projet" },
  secondary: { label: "Écrire à MV Design" },
};
