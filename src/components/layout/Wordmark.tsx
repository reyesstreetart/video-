import Link from "next/link";
import styles from "./Wordmark.module.css";

/**
 * Wordmark HTML « MV DESIGN ». Aucun logo n'existe dans le dépôt : remplacer ce composant
 * par le logo fourni (SVG non déformé) le moment venu, sans toucher au reste du header.
 */
export function Wordmark({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={[styles.wordmark, className ?? ""].join(" ")} aria-label="MV Design — accueil">
      <span className={styles.mono} aria-hidden="true">
        MV
      </span>
      <span className={styles.text}>
        MV <span className={styles.thin}>DESIGN</span>
      </span>
    </Link>
  );
}

/** Monogramme seul (masque du hero, favicon décoratif). */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={[styles.mono, styles.monoLarge, className ?? ""].join(" ")} aria-hidden="true">
      MV
    </span>
  );
}
