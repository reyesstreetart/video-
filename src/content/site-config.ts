/**
 * Configuration centrale de MV Design.
 * Toute donnée vide est masquée automatiquement dans l'interface.
 */
export const siteConfig = {
  name: "MV Design",
  legalName: "MV Design",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr-FR",
  tagline: "Des sites que l’on ne fait pas défiler. On les traverse.",
  promise: "Huit univers. Huit langages visuels. Une même exigence.",
  description:
    "MV Design conçoit des expériences web immersives où l’image, le mouvement et la technologie donnent à chaque marque une présence impossible à confondre.",
  /** Coordonnées : laisser vide pour masquer. */
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    country: "France",
  },
  /** Réseaux : laisser vide pour masquer. */
  social: {
    instagram: "",
    linkedin: "",
    behance: "",
    dribbble: "",
    x: "",
  },
  responseTime: "Réponse personnalisée sous 48 heures ouvrées.",
  nav: [
    { href: "/experiences", label: "Expériences" },
    { href: "/expertise", label: "Expertise" },
    { href: "/methode", label: "Méthode" },
    { href: "/studio", label: "Studio" },
    { href: "/contact", label: "Contact" },
  ],
  cta: { href: "/contact", label: "Démarrer un projet" },
  /**
   * Preuves réelles du studio. Vide = bloc masqué (aucune preuve fabriquée).
   */
  proof: {
    stats: [] as { value: string; label: string }[],
    clients: [] as { name: string; sector?: string }[],
    testimonials: [] as { quote: string; author: string; role?: string }[],
  },
  legal: {
    /** Renseigner ces champs pour finaliser les pages légales. */
    companyForm: "",
    siren: "",
    vat: "",
    publisher: "",
    hostingProvider: "",
    hostingAddress: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const hasValue = (v: string | undefined | null): v is string =>
  typeof v === "string" && v.trim().length > 0;
