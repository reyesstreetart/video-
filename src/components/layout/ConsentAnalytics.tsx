"use client";

import { useEffect, useState } from "react";
import styles from "./ConsentAnalytics.module.css";

const KEY = "mv-analytics-consent";
const SCRIPT = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL ?? "";
const SITE_ID = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID ?? "";

/**
 * Bandeau de consentement minimal : le script d'analytics n'est injecté qu'après acceptation
 * explicite, et uniquement si une URL est configurée. Sans configuration, rien n'est affiché.
 */
export function ConsentAnalytics() {
  const [state, setState] = useState<"unknown" | "accepted" | "refused">("unknown");

  useEffect(() => {
    if (!SCRIPT) return;
    try {
      const v = window.localStorage.getItem(KEY);
      if (v === "accepted" || v === "refused") setState(v);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!SCRIPT || state !== "accepted") return;
    if (document.querySelector(`script[src="${SCRIPT}"]`)) return;
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.defer = true;
    if (SITE_ID) s.dataset.siteId = SITE_ID;
    document.head.appendChild(s);
  }, [state]);

  if (!SCRIPT || state !== "unknown") return null;

  const decide = (v: "accepted" | "refused") => {
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    setState(v);
  };

  return (
    <div className={styles.banner} role="region" aria-label="Consentement aux mesures d’audience">
      <p>Nous souhaitons mesurer l’audience de ce site. Aucun script n’est chargé sans votre accord.</p>
      <div className={styles.actions}>
        <button type="button" className="btn btn--ghost" onClick={() => decide("refused")}>
          Refuser
        </button>
        <button type="button" className="btn btn--primary" onClick={() => decide("accepted")}>
          Accepter
        </button>
      </div>
    </div>
  );
}
