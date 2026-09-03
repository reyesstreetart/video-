/** Contenu fictif de VANTA (Expérience 06). */
export const automotiveContent = {
  maxSpeed: 250,
  counters: [
    { value: "1,9 s", label: "0–60 mph" },
    { value: "1 200 ch", label: "Puissance" },
    { value: "520 mi", label: "Autonomie" },
  ],
  environments: [
    { id: "reveal", at: 0, label: "Reveal", title: "La poussière retombe.", text: "Désert blanc, silence électrique. La signature lumineuse s’allume." },
    { id: "run", at: 0.26, label: "The Run", title: "Départ sur les plaines.", text: "Quatre moteurs, vectorisation du couple, contact pneu-sol constant." },
    { id: "canyon", at: 0.52, label: "The Canyon", title: "Le canyon rouge.", text: "Suspension active, châssis carbone, 1 200 ch disponibles instantanément." },
    { id: "night", at: 0.78, label: "Night Mode", title: "Traînées de lumière sous les étoiles.", text: "Mode nuit : instruments assombris, signature lumineuse au minimum." },
  ],
  stills: [
    { still: "reveal", caption: "Signature lumineuse" },
    { still: "canyon", caption: "Carrosserie obsidienne" },
    { still: "night", caption: "Mode nuit" },
  ],
  colors: [
    { id: "obsidian", label: "Obsidienne mate", hex: "#0b0b0d", glow: "rgba(55,230,255,0.5)" },
    { id: "graphite", label: "Graphite satiné", hex: "#2a2d33", glow: "rgba(55,230,255,0.5)" },
    { id: "ivory", label: "Ivoire nacré", hex: "#d9d3c4", glow: "rgba(22,93,255,0.6)" },
  ],
  deposit: "1 000 $",
};
