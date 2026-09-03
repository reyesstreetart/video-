/**
 * Contenu de la démonstration de portfolio personnel (Expérience 02).
 * Aucune photo n'a été fournie : la personne est une silhouette conceptuelle.
 * Le personnage est fictif et signalé comme tel. Ne renseigner que de vrais chiffres et de vrais liens.
 */
export const portfolioContent = {
  persona: {
    name: "Alex Rivière",
    isFictional: true,
    role: "Direction artistique indépendante · personnage fictif de démonstration",
    activity: "Je conçois des identités et des expériences digitales pour des marques qui veulent être reconnues avant d’être lues.",
    location: "Paris · Lisbonne",
  },
  /** Bandeau de statistiques : vide = masqué. N'afficher que de vrais chiffres. */
  stats: [] as { value: string; label: string }[],
  pillars: [
    { title: "Identité", text: "Logotype, système visuel et ton : la base qui rend une marque reconnaissable à distance." },
    { title: "Présence", text: "Sites, films et contenus qui installent la marque là où son public la cherche." },
    { title: "Réalisations", text: "Direction de projets de bout en bout, du brief à la mise en ligne, avec des équipes réduites." },
  ],
  projects: [
    { title: "Maison Ondine", sector: "Parfumerie", year: "Concept", still: "orbit" },
    { title: "Atelier Nord", sector: "Architecture", year: "Concept", still: "builder" },
    { title: "Studio Kaïros", sector: "Édition", year: "Concept", still: "closer" },
  ],
  cta: {
    title: "Travaillons ensemble.",
    text: "Un projet, une question, une envie de collaborer : écrivez-moi.",
    label: "Me contacter",
    href: "/contact",
  },
  /** Liens sociaux : vide = masqué. Uniquement de vrais liens. */
  social: [] as { label: string; href: string }[],
};
