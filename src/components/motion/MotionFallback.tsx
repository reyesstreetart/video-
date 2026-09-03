import type { PosterSource } from "@/content/media-manifest";
import styles from "./MotionFallback.module.css";

interface MotionFallbackProps {
  poster: PosterSource;
  className?: string;
  /** Léger mouvement CSS (zoom lent) autorisé en mode full/lite. */
  animated?: boolean;
}

/**
 * Affiche le poster lorsque le média animé est absent, en échec ou désactivé.
 * Ne produit jamais un rectangle vide : le poster est requis, le texte et le CTA restent visibles par-dessus.
 */
export function MotionFallback({ poster, className, animated = false }: MotionFallbackProps) {
  return (
    <div className={[styles.fallback, animated ? styles.animated : "", className ?? ""].join(" ")} aria-hidden="true">
      <picture>
        <source media="(orientation: portrait) and (max-width: 899px)" srcSet={poster.mobile} />
        <img src={poster.desktop} alt="" decoding="async" loading="eager" />
      </picture>
    </div>
  );
}
