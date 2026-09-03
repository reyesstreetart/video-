"use client";

import { useMotionMode } from "@/components/motion/MotionModeProvider";
import { readStoredMode } from "@/lib/motion-mode";
import { useEffect, useState } from "react";
import styles from "./MotionToggle.module.css";

/** Permet de forcer le mode static (ou de revenir au mode automatique). */
export function MotionToggle() {
  const { mode, setMode } = useMotionMode();
  const [manual, setManual] = useState(false);
  useEffect(() => {
    setManual(readStoredMode() !== null);
  }, [mode]);
  const isStatic = mode === "static";
  return (
    <div className={styles.toggle}>
      <span className={styles.label}>Animations : {mode === "full" ? "complètes" : mode === "lite" ? "allégées" : "désactivées"}</span>
      <button type="button" className={styles.button} onClick={() => setMode(isStatic ? "full" : "static")}>
        {isStatic ? "Réactiver les animations" : "Désactiver les animations"}
      </button>
      {manual ? (
        <button type="button" className={styles.button} onClick={() => setMode(null)}>
          Mode automatique
        </button>
      ) : null}
    </div>
  );
}
