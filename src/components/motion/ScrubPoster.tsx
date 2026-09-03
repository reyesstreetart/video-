"use client";

import { useEffect, useRef } from "react";
import type { PosterSource } from "@/content/media-manifest";
import { useChapter } from "./ScrollChapter";
import { rangeProgress } from "@/lib/scroll-progress";
import styles from "./ScrubPoster.module.css";

interface ScrubPosterProps {
  poster: PosterSource;
  /** Sous-plage de progression pendant laquelle le poster est visible. */
  range?: [number, number];
  /** Zoom de départ et d'arrivée (travelling macro léger). */
  scale?: [number, number];
  /** Déplacement horizontal en % de la largeur. */
  pan?: [number, number];
  className?: string;
  /** Fondu d'entrée/sortie (fraction de la plage). */
  fade?: number;
}

/**
 * Poster « scrubé » : zoom/pan et fondu pilotés par la progression, sans média vidéo.
 * Utilisé pour les scènes secondaires (macro, travelling) tant que la séquence réelle n'est pas fournie.
 */
export function ScrubPoster({ poster, range = [0, 1], scale = [1, 1.12], pan = [0, 0], className, fade = 0.15 }: ScrubPosterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { subscribe, isStatic } = useChapter();

  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    const img = imgRef.current;
    if (!el || !img) return;
    return subscribe((p) => {
      const t = rangeProgress(p, range[0], range[1]);
      const inRange = p >= range[0] && p <= range[1];
      let o = inRange ? 1 : 0;
      if (inRange) {
        if (range[0] > 0 && t < fade) o = t / fade;
        else if (range[1] < 1 && t > 1 - fade) o = (1 - t) / fade;
      }
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o <= 0.001 ? "hidden" : "visible";
      const s = scale[0] + (scale[1] - scale[0]) * t;
      const x = pan[0] + (pan[1] - pan[0]) * t;
      img.style.transform = `translate3d(${x.toFixed(2)}%, 0, 0) scale(${s.toFixed(4)})`;
    });
  }, [subscribe, isStatic, range, scale, pan, fade]);

  return (
    <div ref={ref} className={[styles.wrap, isStatic ? styles.static : "", className ?? ""].join(" ")} aria-hidden="true">
      <picture>
        <source media="(orientation: portrait) and (max-width: 899px)" srcSet={poster.mobile} />
        <img ref={imgRef} src={poster.desktop} alt="" decoding="async" loading="lazy" />
      </picture>
    </div>
  );
}
