"use client";

import { useEffect } from "react";
import { preloadPoster } from "@/lib/media-loader";

/** Précharge uniquement le poster de l'expérience suivante, une fois la page inactive. */
export function PreloadNextPoster({ href }: { href: string }) {
  useEffect(() => {
    const run = () => preloadPoster(href);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(run, 2500);
    return () => clearTimeout(t);
  }, [href]);
  return null;
}
