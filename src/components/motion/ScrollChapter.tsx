"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createChapterTracker, type ChapterTracker, type ProgressListener } from "@/lib/scroll-progress";
import { useMotionMode } from "./MotionModeProvider";
import styles from "./ScrollChapter.module.css";

interface ChapterContextValue {
  subscribe: (fn: ProgressListener) => () => void;
  getProgress: () => number;
  id: string;
  isStatic: boolean;
}

const ChapterContext = createContext<ChapterContextValue | null>(null);

export function useChapter(): ChapterContextValue {
  const ctx = useContext(ChapterContext);
  if (!ctx) throw new Error("useChapter must be used inside <ScrollChapter>");
  return ctx;
}

/**
 * Abonnement à la progression sans re-render React : le callback reçoit 0..1 à chaque frame utile.
 */
export function useChapterProgress(fn: ProgressListener) {
  const { subscribe } = useChapter();
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => subscribe((p) => ref.current(p)), [subscribe]);
}

interface ScrollChapterProps {
  /** Hauteur de la section en svh (260–380 conseillé). */
  height?: number;
  children: ReactNode;
  className?: string;
  label: string;
  id?: string;
  /** Contenu affiché sous la scène quand la page est en mode static (ex. texte + CTA). */
  staticFallback?: ReactNode;
  style?: CSSProperties;
  /** Lien « Passer l'animation » vers l'ancre située après le chapitre. */
  skipLabel?: string;
}

export function ScrollChapter({
  height = 320,
  children,
  className,
  label,
  id,
  style,
  skipLabel = "Passer l’animation",
}: ScrollChapterProps) {
  const autoId = useId();
  const chapterId = id ?? `chapter-${autoId.replace(/[:]/g, "")}`;
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<ChapterTracker | null>(null);
  const { mode } = useMotionMode();
  const isStatic = mode === "static";
  const listeners = useRef(new Set<ProgressListener>());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;
    const tracker = createChapterTracker(section, () => sticky.getBoundingClientRect().height || window.innerHeight);
    trackerRef.current = tracker;
    const unsub = tracker.subscribe((p) => {
      section.style.setProperty("--p", p.toFixed(4));
      listeners.current.forEach((fn) => fn(p));
    });
    setReady(true);
    return () => {
      unsub();
      tracker.destroy();
      trackerRef.current = null;
    };
  }, []);

  const value = useMemo<ChapterContextValue>(
    () => ({
      id: chapterId,
      isStatic,
      subscribe: (fn) => {
        listeners.current.add(fn);
        const t = trackerRef.current;
        if (t) fn(t.getProgress());
        return () => {
          listeners.current.delete(fn);
        };
      },
      getProgress: () => trackerRef.current?.getProgress() ?? 0,
    }),
    [chapterId, isStatic],
  );

  const skipTarget = `${chapterId}-end`;

  return (
    <ChapterContext.Provider value={value}>
      <section
        ref={sectionRef}
        id={chapterId}
        className={[styles.chapter, className ?? ""].join(" ")}
        style={{ ["--chapter-height" as string]: `${height}svh`, ...style }}
        aria-label={label}
        data-chapter
        data-ready={ready ? "true" : "false"}
      >
        <a className={styles.skip} href={`#${skipTarget}`}>
          {skipLabel}
        </a>
        <div ref={stickyRef} className={styles.sticky}>
          {children}
        </div>
      </section>
      <div id={skipTarget} className={styles.end} tabIndex={-1} aria-hidden="true" />
    </ChapterContext.Provider>
  );
}
