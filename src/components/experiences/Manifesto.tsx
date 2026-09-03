import { Reveal } from "@/components/motion/Reveal";
import styles from "./Manifesto.module.css";

/** Manifeste : IMMERSIF. FLUIDE. MÉMORABLE. apparaissent successivement. */
export function Manifesto() {
  return (
    <section className={["section", styles.manifesto].join(" ")} aria-labelledby="manifesto-title">
      <span className="halo" style={{ width: 600, height: 600, right: "-15%", top: "-10%" }} aria-hidden="true" />
      <div className="container">
        <div className="grid-12">
          <div className={styles.head}>
            <Reveal as="p" className="eyebrow eyebrow--gold">
              LE WEB, MIS EN SCÈNE
            </Reveal>
            <Reveal delay={80}>
              <h2 id="manifesto-title" className="h1">
                Huit univers. Huit langages visuels. Une même exigence.
              </h2>
            </Reveal>
            <Reveal as="p" className="lead" delay={160}>
              Un site remarquable ne repose pas sur l’accumulation d’effets. Il repose sur un rythme, une intention et une maîtrise du détail. MV Design transforme chaque défilement en progression narrative.
            </Reveal>
          </div>
          <ul className={styles.words} aria-label="Trois qualités">
            {["IMMERSIF.", "FLUIDE.", "MÉMORABLE."].map((w, i) => (
              <Reveal as="li" key={w} delay={200 + i * 260} className={styles.word}>
                {w}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
