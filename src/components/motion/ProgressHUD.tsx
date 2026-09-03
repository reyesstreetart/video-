"use client";

import { useEffect, useRef } from "react";
import { useChapter } from "./ScrollChapter";
import styles from "./ProgressHUD.module.css";

interface ProgressHUDProps {
  label: string;
  /** Formatage de la valeur affichée. */
  format: (progress: number) => string;
  /** Étapes affichées sous la valeur (surlignage de l'étape courante). */
  steps?: { at: number; label: string }[];
  className?: string;
  align?: "left" | "right";
}

/**
 * HUD fixe (profondeur, vitesse, étapes) synchronisé sur la progression de la scène.
 */
export function ProgressHUD({ label, format, steps, className, align = "left" }: ProgressHUDProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const { subscribe, isStatic } = useChapter();

  useEffect(() => {
    return subscribe((p) => {
      if (valueRef.current) valueRef.current.textContent = format(p);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (stepsRef.current && steps) {
        let current = 0;
        steps.forEach((s, i) => {
          if (p >= s.at) current = i;
        });
        Array.from(stepsRef.current.children).forEach((li, i) => {
          li.setAttribute("aria-current", i === current ? "step" : "false");
        });
      }
    });
  }, [subscribe, format, steps]);

  return (
    <div
      className={[styles.hud, align === "right" ? styles.right : "", isStatic ? styles.static : "", className ?? ""].join(" ")}
      role="status"
      aria-live="off"
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.value} ref={valueRef}>
        {format(0)}
      </span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.bar} ref={barRef} />
      </span>
      {steps ? (
        <ol className={styles.steps} ref={stepsRef}>
          {steps.map((s) => (
            <li key={s.label}>{s.label}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
