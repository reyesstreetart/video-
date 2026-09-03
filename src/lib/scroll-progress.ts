/**
 * Moteur de progression sur scroll natif.
 * Un seul requestAnimationFrame partagé par toutes les scènes : chaque tracker lit la position
 * de sa section et publie une progression 0..1 strictement réversible.
 * Aucun preventDefault, aucun scroll-lock, aucun faux scroll.
 */

export type ProgressListener = (progress: number) => void;

interface Tracker {
  el: HTMLElement;
  stickyHeight: () => number;
  listeners: Set<ProgressListener>;
  last: number;
  active: boolean;
  observer: IntersectionObserver | null;
}

const trackers = new Set<Tracker>();
let rafId = 0;
let bound = false;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function computeProgress(t: Tracker): number {
  const rect = t.el.getBoundingClientRect();
  const sticky = t.stickyHeight();
  const travel = rect.height - sticky;
  if (travel <= 0) return rect.top <= 0 ? 1 : 0;
  return clamp01(-rect.top / travel);
}

function tick() {
  rafId = 0;
  for (const t of trackers) {
    if (!t.active) continue;
    const p = computeProgress(t);
    if (p !== t.last) {
      t.last = p;
      t.listeners.forEach((fn) => fn(p));
    }
  }
}

export function scheduleFrame() {
  if (rafId) return;
  rafId = requestAnimationFrame(tick);
}

function bindGlobal() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  const opts: AddEventListenerOptions = { passive: true };
  window.addEventListener("scroll", scheduleFrame, opts);
  window.addEventListener("resize", scheduleFrame, opts);
  window.addEventListener("orientationchange", scheduleFrame, opts);
  window.addEventListener("pageshow", scheduleFrame, opts);
  window.addEventListener("load", scheduleFrame, opts);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", scheduleFrame, opts);
  if (document.fonts?.ready) document.fonts.ready.then(scheduleFrame).catch(() => {});
}

export interface ChapterTracker {
  subscribe: (fn: ProgressListener) => () => void;
  getProgress: () => number;
  destroy: () => void;
  /** Force un recalcul (ex. après chargement d'un média). */
  refresh: () => void;
}

/**
 * Attache un tracker à une section. `stickyHeight` retourne la hauteur de l'élément sticky
 * (100svh) pour calculer la course utile.
 */
export function createChapterTracker(el: HTMLElement, stickyHeight: () => number): ChapterTracker {
  bindGlobal();
  const t: Tracker = {
    el,
    stickyHeight,
    listeners: new Set(),
    last: -1,
    active: true,
    observer: null,
  };
  trackers.add(t);

  if (typeof IntersectionObserver !== "undefined") {
    t.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          t.active = e.isIntersecting;
          if (t.active) scheduleFrame();
        }
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    t.observer.observe(el);
  }

  // Premier calcul synchrone : évite l'écran noir sur rechargement en milieu de scène.
  t.last = computeProgress(t);
  scheduleFrame();

  return {
    subscribe(fn) {
      t.listeners.add(fn);
      fn(t.last < 0 ? computeProgress(t) : t.last);
      return () => {
        t.listeners.delete(fn);
      };
    },
    getProgress: () => (t.last < 0 ? computeProgress(t) : t.last),
    refresh() {
      t.last = -1;
      scheduleFrame();
    },
    destroy() {
      t.observer?.disconnect();
      trackers.delete(t);
    },
  };
}

/** Index de frame pour une progression 0..1. */
export const frameIndexFor = (progress: number, frameCount: number): number =>
  Math.round(clamp01(progress) * (frameCount - 1));

/** Normalise une progression globale vers une sous-plage [from, to]. */
export const rangeProgress = (p: number, from: number, to: number): number =>
  clamp01((p - from) / (to - from));
