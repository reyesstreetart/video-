import type { Metadata } from "next";
import { ExperienceIndex } from "@/components/experiences/ExperienceIndex";
import { ContactCTA } from "@/components/ui/ContactCTA";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Les huit expériences",
  description:
    "Portfolio complet de MV Design : huit expériences web immersives, huit univers, huit interactions pilotées par le scroll. Concepts expérimentaux clairement identifiés.",
  alternates: { canonical: "/experiences" },
};

export default function ExperiencesPage() {
  return (
    <>
      <div className={styles.spacer} />
      <ExperienceIndex
        as="h1"
        eyebrow="PORTFOLIO · HUIT EXPÉRIENCES"
        title="Huit univers. Huit langages visuels. Une même exigence."
        text="Chaque expérience est un concept expérimental MV Design : marque fictive, univers complet, hero dynamique et interaction principale. Traversez-les dans l’ordre ou selon votre secteur."
        id="portfolio"
      />
      <ContactCTA />
    </>
  );
}
