import Link from "next/link";
import type { Experience } from "@/content/experiences";
import { Reveal } from "@/components/motion/Reveal";
import { FictionalNotice } from "./FictionalNotice";
import styles from "./KnowHowSection.module.css";

/** Présentation claire du savoir-faire MV Design sur chaque page projet. */
export function KnowHowSection({ experience }: { experience: Experience }) {
  return (
    <section className={["section", "section--far", styles.section].join(" ")} aria-labelledby={`knowhow-${experience.slug}`}>
      <div className="container">
        <div className={styles.head}>
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Savoir-faire MV Design · Expérience {experience.number}
          </Reveal>
          <Reveal delay={80}>
            <h2 id={`knowhow-${experience.slug}`} className="h2">
              Ce que MV Design a mis en scène.
            </h2>
          </Reveal>
          <Reveal as="p" className="lead" delay={140}>
            {experience.interaction}
          </Reveal>
        </div>
        <ol className={styles.list}>
          {experience.knowHow.map((k, i) => (
            <Reveal as="li" key={k.title} delay={i * 90} className={styles.item}>
              <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h3">{k.title}</h3>
              <p>{k.text}</p>
            </Reveal>
          ))}
        </ol>
        <div className={styles.foot}>
          <FictionalNotice note={experience.fictionalNote} />
          <Link href="/contact" className="btn btn--primary">
            Imaginer une expérience pour ma marque
          </Link>
        </div>
      </div>
    </section>
  );
}
