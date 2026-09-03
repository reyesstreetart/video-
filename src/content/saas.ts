/** Contenu fictif de PULSE (Expérience 07). Toutes les métriques sont des données de démonstration. */
export const saasContent = {
  h1: "Voyez le churn arriver.",
  sub: "PULSE analyse le comportement de vos clients et prédit les départs 30 jours avant qu’ils ne se produisent.",
  features: [
    { id: "predict", title: "Prédire", text: "Un score de risque par compte, recalculé chaque nuit à partir de l’usage, du support et de la facturation." },
    { id: "explain", title: "Expliquer", text: "Les trois facteurs qui pèsent le plus dans chaque prédiction, en langage clair, pas en coefficients." },
    { id: "prevent", title: "Prévenir", text: "Des playbooks déclenchés automatiquement : e-mail, tâche CRM, alerte Slack, appel planifié." },
  ],
  metrics: [
    { value: "94 %", label: "Précision à 30 jours" },
    { value: "−38 %", label: "Churn après 6 mois" },
    { value: "12 min", label: "Mise en place" },
  ],
  dashboard: {
    accounts: [
      { name: "Nordlicht GmbH", risk: 91, trend: "up", mrr: "4 200 €" },
      { name: "Atelier Lune", risk: 74, trend: "up", mrr: "1 850 €" },
      { name: "Kestrel Labs", risk: 38, trend: "down", mrr: "9 600 €" },
      { name: "Maison Ondine", risk: 12, trend: "down", mrr: "2 300 €" },
    ],
    series: [22, 26, 24, 31, 29, 35, 33, 41, 38, 46, 44, 52],
  },
  pricing: [
    { name: "Starter", price: "0 €", period: "pour toujours", features: ["Jusqu’à 200 comptes", "Score de risque", "1 intégration"], cta: "Commencer gratuitement", featured: false },
    { name: "Growth", price: "490 €", period: "par mois", features: ["Comptes illimités", "Explications et playbooks", "CRM, Slack, e-mail", "Support prioritaire"], cta: "Essayer 14 jours", featured: true },
    { name: "Enterprise", price: "Sur devis", period: "", features: ["SSO et audit", "Modèles dédiés", "Déploiement privé", "Accompagnement"], cta: "Parler à l’équipe", featured: false },
  ],
  faq: [
    { q: "Quelles données PULSE utilise-t-il ?", a: "Les événements produit, les tickets de support et les données de facturation que vous connectez. Rien n’est collecté sans intégration explicite." },
    { q: "Combien de temps avant les premiers scores ?", a: "Un historique de 90 jours suffit. Les premiers scores apparaissent en moins de 24 heures après la connexion." },
    { q: "Les prédictions sont-elles explicables ?", a: "Oui. Chaque score est accompagné des trois facteurs principaux et de leur poids relatif." },
    { q: "Ces chiffres sont-ils réels ?", a: "Non. PULSE est un concept expérimental MV Design : les métriques, comptes et tarifs sont des données de démonstration." },
  ],
};
