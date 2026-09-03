import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { ExperienceCard } from "./ExperienceCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ExperienceIndex.module.css";

interface ExperienceIndexProps {
  eyebrow?: string;
  title?: string;
  text?: string;
  as?: "h1" | "h2";
  id?: string;
}

/** Index éditorial numéroté 01 → 08. */
export function ExperienceIndex({
  eyebrow = "LES HUIT EXPÉRIENCES",
  title = "Huit univers à traverser.",
  text = "Chaque expérience est un concept complet : une marque, un langage visuel et une interaction principale pilotée par le scroll.",
  as = "h2",
  id = "experiences",
}: ExperienceIndexProps) {
  return (
    <section id={id} className={["section", styles.index].join(" ")} aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={<span id={`${id}-title`}>{title}</span>} text={text} as={as} size={as === "h1" ? "h1" : "h2"} />
        <ol className={styles.list} data-experience-index>
          {experiences.map((e, i) => (
            <ExperienceCard key={e.slug} experience={e} media={mediaManifest[e.slug].preview} index={i} priority={i === 0} />
          ))}
        </ol>
      </div>
    </section>
  );
}
