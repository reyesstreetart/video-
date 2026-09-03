import Link from "next/link";
import type { Experience } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import styles from "./NextExperience.module.css";

/** Lien vers l'expérience suivante (poster seulement, préchargé côté client par la page). */
export function NextExperience({ next }: { next: Experience }) {
  const media = mediaManifest[next.slug];
  return (
    <section className={styles.next} aria-label="Expérience suivante">
      <Link href={`/experiences/${next.slug}`} className={styles.link} style={{ ["--scene-accent" as string]: next.accent }}>
        <picture className={styles.poster}>
          <source media="(max-width: 640px)" srcSet={media.poster.mobile} />
          <img src={media.poster.desktop} alt="" loading="lazy" decoding="async" />
        </picture>
        <span className={styles.content}>
          <span className="eyebrow eyebrow--gold">Expérience suivante · {next.number}</span>
          <span className={["h2", styles.title].join(" ")}>{next.sector}</span>
          <span className={styles.sub}>{next.indexTitle}</span>
          <span className="link-arrow">Traverser</span>
        </span>
      </Link>
    </section>
  );
}
