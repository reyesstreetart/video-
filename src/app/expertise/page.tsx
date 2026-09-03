import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactCTA } from "@/components/ui/ContactCTA";
import { Reveal } from "@/components/motion/Reveal";
import { services, expertiseIntro } from "@/content/services";
import { experiences } from "@/content/experiences";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Expertise",
  description: "Stratégie, direction artistique, motion, développement créatif et performance : l’expertise complète de MV Design, de l’idée à la mise en ligne.",
  alternates: { canonical: "/expertise" },
};

export default function ExpertisePage() {
  return (
    <>
      <PageIntro eyebrow={expertiseIntro.eyebrow} title={expertiseIntro.title} text={expertiseIntro.text} />
      <section className="section section--tight" aria-label="Disciplines">
        <div className="container">
          <ol className={styles.list}>
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} className={styles.item} delay={i * 60}>
                <div className={styles.itemHead}>
                  <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="h2">{s.title}</h2>
                  <p className="lead">{s.description}</p>
                </div>
                <ul className={styles.details}>
                  {s.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section section--far" aria-labelledby="expertise-proof">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            En pratique
          </Reveal>
          <Reveal delay={80}>
            <h2 id="expertise-proof" className="h2">
              Huit démonstrations, une même chaîne de production.
            </h2>
          </Reveal>
          <ul className={styles.demoGrid}>
            {experiences.map((e, i) => (
              <Reveal as="li" key={e.slug} delay={i * 50} className={styles.demo} style={{ ["--scene-accent" as string]: e.accent }}>
                <Link href={`/experiences/${e.slug}`}>
                  <span className="numeral">{e.number}</span>
                  <span className={styles.demoSector}>{e.sector}</span>
                  <span className={styles.demoInteraction}>{e.interaction}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
