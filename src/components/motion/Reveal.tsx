"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "p" | "li" | "h2" | "h3" | "span" | "figure";
  style?: CSSProperties;
  /** Une fois visible, reste visible. */
  once?: boolean;
}

/** Apparition douce au scroll (masque + opacité + court déplacement). Désactivée en mode static. */
export function Reveal({ children, className, delay = 0, as: Tag = "div", style, once = true }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.dataset.motion === "static") {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.visible = "true";
            if (once) io.unobserve(el);
          } else if (!once) {
            el.dataset.visible = "false";
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  const Component = Tag as "div";
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={[styles.reveal, className ?? ""].join(" ")}
      style={{ ["--reveal-delay" as string]: `${delay}ms`, ...style }}
      data-visible="false"
    >
      {children}
    </Component>
  );
}
