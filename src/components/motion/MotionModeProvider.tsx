"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { detectMotionMode, storeMode, type MotionMode } from "@/lib/motion-mode";

interface MotionContextValue {
  mode: MotionMode;
  /** Choix explicite de l'utilisateur (null = automatique). */
  setMode: (mode: MotionMode | null) => void;
  /** Bascule en static après échecs répétés de décodage. */
  degrade: () => void;
}

const MotionContext = createContext<MotionContextValue>({
  mode: "full",
  setMode: () => {},
  degrade: () => {},
});

export function MotionModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<MotionMode>("full");

  useEffect(() => {
    const apply = () => {
      const m = detectMotionMode();
      setModeState(m);
      document.documentElement.dataset.motion = m;
    };
    apply();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const setMode = useCallback((m: MotionMode | null) => {
    storeMode(m);
    const next = m ?? detectMotionMode();
    setModeState(next);
    document.documentElement.dataset.motion = next;
  }, []);

  const degrade = useCallback(() => {
    setModeState("static");
    document.documentElement.dataset.motion = "static";
  }, []);

  const value = useMemo(() => ({ mode, setMode, degrade }), [mode, setMode, degrade]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotionMode = () => useContext(MotionContext);
