"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useChapter } from "./ScrollChapter";
import { easeInOut } from "@/lib/utils";
import styles from "./SceneOverlay.module.css";

interface SceneOverlayProps {
  children: ReactNode;
  className?: string;
}

/** Couche de contenu par-dessus la scène : texte, callouts, CTA. */
export function SceneOverlay({ children, className }: SceneOverlayProps) {
  return <div className={[styles.overlay, className ?? ""].join(" ")}>{children}</div>;
}

interface OverlayItemProps {
  /** Progression à laquelle l'élément commence à apparaître. */
  from: number;
  /** Progression à laquelle l'élément a disparu. */
  to: number;
  /** Durée relative du fondu d'entrée/sortie (fraction de [from,to]). */
  fade?: number;
  /** Déplacement vertical en px pendant le fondu. */
  shift?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "p" | "h2" | "h3" | "figure" | "ul" | "li";
  /** Toujours visible en mode static (sinon masqué). */
  staticVisible?: boolean;
}

/**
 * Élément dont l'opacité et le déplacement dépendent de la progression du chapitre.
 * Mise à jour directe du DOM (aucun re-render React).
 */
export function OverlayItem({
  from,
  to,
  fade = 0.2,
  shift = 24,
  children,
  className,
  style,
  as: Tag = "div",
  staticVisible = true,
}: OverlayItemProps) {
  const ref = useRef<HTMLElement>(null);
  const { subscribe, isStatic } = useChapter();

  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    if (!el) return;
    const span = to - from;
    const f = Math.max(0.001, fade * span);
    return subscribe((p) => {
      let o: number;
      if (p < from || p > to) o = 0;
      else if (p < from + f) o = (p - from) / f;
      else if (p > to - f) o = (to - p) / f;
      else o = 1;
      const e = easeInOut(Math.min(1, Math.max(0, o)));
      const dir = p < from + f ? 1 : p > to - f ? -1 : 0;
      el.style.opacity = e.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - e) * shift * dir).toFixed(1)}px, 0)`;
      el.style.visibility = e <= 0.001 ? "hidden" : "visible";
      el.style.pointerEvents = e > 0.5 ? "auto" : "none";
    });
  }, [from, to, fade, shift, subscribe, isStatic]);

  const Component = Tag as "div";
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={[styles.item, isStatic ? (staticVisible ? styles.static : styles.hidden) : "", className ?? ""].join(" ")}
      style={style}
      data-overlay-item
    >
      {children}
    </Component>
  );
}
