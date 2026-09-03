/** Contenu fictif de THE MERIDIAN (Expérience 05). Le bien n'existe pas et n'est pas à vendre. */
export const realEstateContent = {
  price: "$12 500 000",
  floor: "60e étage",
  facts: [
    { value: "4", label: "Chambres" },
    { value: "5,5", label: "Salles de bains" },
    { value: "7 200 sq ft", label: "Surface" },
    { value: "Privé", label: "Ascenseur" },
  ],
  stages: [
    { id: "approach", at: 0, label: "Approche", title: "Soixante étages au-dessus de tout.", text: "La tour s’allume au crépuscule. Le drone tourne, la ville s’éveille en contrebas." },
    { id: "arrival", at: 0.24, label: "Arrivée", title: "L’ascenseur privé s’ouvre sur le séjour.", text: "Quatorze mètres de vitrage, marbre Calacatta, plafond de 3,6 m." },
    { id: "living", at: 0.46, label: "Séjour", title: "Un séjour tourné vers l’horizon.", text: "Cuisine ouverte, cave vitrée, cheminée suspendue. Orientation sud-ouest." },
    { id: "suite", at: 0.66, label: "Suite", title: "La suite principale, côté lever du soleil.", text: "Dressing traversant, salle de bains en onyx, terrasse privative." },
    { id: "terrace", at: 0.84, label: "Terrasse", title: "Piscine à débordement, skyline de nuit.", text: "Deux cent quarante mètres carrés à ciel ouvert, cuisine d’été, spa." },
  ],
  amenities: ["Ascenseur privé", "Piscine à débordement", "Cave à vin vitrée", "Conciergerie 24/7", "Domotique intégrée", "Parking 4 places", "Spa et salle de sport", "Sécurité biométrique"],
  gallery: [
    { still: "arrival", caption: "Arrivée · séjour vitré" },
    { still: "flow", caption: "Cuisine et suite" },
    { still: "terrace", caption: "Terrasse · piscine" },
  ],
};
