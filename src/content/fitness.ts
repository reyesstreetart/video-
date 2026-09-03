/** Contenu fictif de FORGE (Expérience 08). Coachs conceptuels, tarifs et résultats de démonstration. */
export const fitnessContent = {
  motto: "Earn it.",
  philosophy: ["Pas de raccourci.", "Pas de miroir.", "Du fer, du temps, et la volonté d’y revenir demain.", "Ce que tu gagnes ici, personne ne peut te le prendre."],
  programs: [
    { id: "force", title: "Force", text: "Squat, développé, soulevé. Cycles de 8 semaines, charges progressives, technique avant tout.", level: "Tous niveaux" },
    { id: "conditionnement", title: "Conditionnement", text: "Intervalles, sled, rameur, corde. Quarante minutes qui ne pardonnent pas.", level: "Intermédiaire" },
    { id: "equipe", title: "Équipe", text: "Groupes de six, coach dédié, classement hebdomadaire. La pression du groupe, en mieux.", level: "Sur sélection" },
  ],
  coaches: [
    { id: "a", name: "Coach A", role: "Force · profil conceptuel", text: "Ancien compétiteur, obsédé par la technique du soulevé de terre." },
    { id: "b", name: "Coach B", role: "Conditionnement · profil conceptuel", text: "Athlète d’endurance, spécialiste des intervalles à haute intensité." },
    { id: "c", name: "Coach C", role: "Équipe · profil conceptuel", text: "Préparateur physique, construit des groupes qui tiennent dans la durée." },
  ],
  results: [
    { value: "+42 kg", label: "Squat moyen en 6 mois" },
    { value: "−9 %", label: "Masse grasse moyenne" },
    { value: "87 %", label: "Membres présents à 12 mois" },
  ],
  pricing: [
    { name: "Accès", price: "69 €", period: "par mois", features: ["Plateau libre 6h–23h", "Vestiaires et sauna", "Application de suivi"], featured: false },
    { name: "Coaching", price: "149 €", period: "par mois", features: ["Tout Accès", "2 séances coachées / semaine", "Programme personnalisé", "Bilan mensuel"], featured: true },
    { name: "Équipe", price: "219 €", period: "par mois", features: ["Tout Coaching", "Groupe de six", "Classement et défis", "Stage trimestriel"], featured: false },
  ],
  schedule: [
    { day: "Lun", slots: ["06:30 Force", "12:15 Conditionnement", "19:00 Équipe"] },
    { day: "Mar", slots: ["07:00 Conditionnement", "18:30 Force"] },
    { day: "Mer", slots: ["06:30 Force", "12:15 Conditionnement", "19:00 Équipe"] },
    { day: "Jeu", slots: ["07:00 Conditionnement", "18:30 Force"] },
    { day: "Ven", slots: ["06:30 Force", "18:00 Équipe"] },
    { day: "Sam", slots: ["09:00 Open gym", "10:30 Conditionnement"] },
  ],
  address: "48 rue des Aciéries · 93400 Saint-Ouen (adresse fictive)",
};
