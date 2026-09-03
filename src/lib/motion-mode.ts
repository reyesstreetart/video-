/**
 * Modes de mouvement :
 *  - full   : séquences complètes, previews vidéo, DPR jusqu'à 2 (1,5 sur mobile)
 *  - lite   : une frame sur deux, DPR 1, previews vidéo désactivées
 *  - static : posters uniquement, aucune animation pilotée par le scroll
 *
 * static est activé par prefers-reduced-motion, l'absence de JavaScript (CSS), un choix explicite
 * de l'utilisateur ou des échecs répétés de décodage.
 */
export type MotionMode = "full" | "lite" | "static";

export const MOTION_STORAGE_KEY = "mv-motion-mode";

interface NavigatorExtras {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
}

export function readStoredMode(): MotionMode | null {
  try {
    const v = window.localStorage.getItem(MOTION_STORAGE_KEY);
    return v === "full" || v === "lite" || v === "static" ? v : null;
  } catch {
    return null;
  }
}

export function storeMode(mode: MotionMode | null) {
  try {
    if (mode) window.localStorage.setItem(MOTION_STORAGE_KEY, mode);
    else window.localStorage.removeItem(MOTION_STORAGE_KEY);
  } catch {
    /* stockage indisponible */
  }
}

export function detectMotionMode(): MotionMode {
  if (typeof window === "undefined") return "full";
  const stored = readStoredMode();
  if (stored) return stored;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  const nav = navigator as Navigator & NavigatorExtras;
  const conn = nav.connection;
  if (conn?.saveData) return "lite";
  if (conn?.effectiveType && /(^|\b)(slow-2g|2g|3g)\b/.test(conn.effectiveType)) return "lite";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return "lite";
  return "full";
}

/** Script inline exécuté avant l'hydratation pour éviter tout flash de mode. */
export const motionModeBootScript = `(function(){try{var k="${MOTION_STORAGE_KEY}";var s=localStorage.getItem(k);var m=(s==="full"||s==="lite"||s==="static")?s:null;if(!m){if(matchMedia("(prefers-reduced-motion: reduce)").matches)m="static";else{var c=navigator.connection;if(c&&(c.saveData||/(^|\\b)(slow-2g|2g|3g)\\b/.test(c.effectiveType||"")))m="lite";else if(typeof navigator.deviceMemory==="number"&&navigator.deviceMemory<=2)m="lite";else m="full";}}document.documentElement.dataset.motion=m;document.documentElement.dataset.js="true";}catch(e){document.documentElement.dataset.motion="full";document.documentElement.dataset.js="true";}})();`;

export function maxDevicePixelRatio(mode: MotionMode): number {
  if (typeof window === "undefined") return 1;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cap = mode === "lite" ? 1 : coarse ? 1.5 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function isPortraitViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(orientation: portrait)").matches && window.innerWidth < 900;
}
