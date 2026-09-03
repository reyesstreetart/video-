"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PreviewMedia } from "@/content/media-manifest";
import { playPreview, releasePreview, stopPreview } from "@/lib/preview-controller";
import { useMotionMode } from "./MotionModeProvider";
import styles from "./VideoPreview.module.css";

interface VideoPreviewProps {
  media: PreviewMedia;
  /** Active la lecture (hover/focus de la carte parente). */
  active: boolean;
  /** Sur mobile : lecture lorsque la carte est majoritairement visible. */
  autoplayWhenVisible?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Preview vidéo légère : poster immédiat, vidéo chargée seulement au premier hover/focus/visibilité.
 * Une seule preview joue à la fois (preview-controller). Hors zone, la vidéo est libérée.
 */
export function VideoPreview({ media, active, autoplayWhenVisible = false, className, priority = false }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { mode } = useMotionMode();
  const [visibleActive, setVisibleActive] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [broken, setBroken] = useState(false);
  const hasVideo = !broken && mode === "full" && !!(media.video?.desktop.webm || media.video?.desktop.mp4);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const ensureSources = useCallback(() => {
    const v = videoRef.current;
    if (!v || !media.video) return;
    if (v.getAttribute("data-loaded") === "true") return;
    const src = media.video.desktop;
    if (src.webm) {
      const s = document.createElement("source");
      s.src = src.webm;
      s.type = "video/webm";
      v.appendChild(s);
    }
    if (src.mp4) {
      const s = document.createElement("source");
      s.src = src.mp4;
      s.type = "video/mp4";
      v.appendChild(s);
    }
    // L'erreur d'un <source> ne remonte pas au <video> : on l'écoute sur le dernier <source>.
    const last = v.lastElementChild;
    if (last) last.addEventListener("error", () => setBroken(true), { once: true });
    v.setAttribute("data-loaded", "true");
    v.load();
  }, [media.video]);

  // Lecture hover/focus (desktop).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasVideo) return;
    if (active && canHover) {
      ensureSources();
      playPreview(v);
    } else if (!autoplayWhenVisible || canHover) {
      stopPreview(v);
    }
  }, [active, canHover, hasVideo, ensureSources, autoplayWhenVisible]);

  // Lecture par visibilité (mobile) + libération hors zone.
  useEffect(() => {
    const v = videoRef.current;
    const wrap = wrapRef.current;
    if (!v || !wrap || !hasVideo) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.75 && autoplayWhenVisible && !canHover) {
            ensureSources();
            playPreview(v);
            setVisibleActive(true);
          } else if (!e.isIntersecting) {
            releasePreview(v);
            setVisibleActive(false);
          } else if (autoplayWhenVisible && !canHover) {
            stopPreview(v);
            setVisibleActive(false);
          }
        }
      },
      { threshold: [0, 0.75] },
    );
    io.observe(wrap);
    return () => {
      io.disconnect();
      releasePreview(v);
    };
  }, [hasVideo, autoplayWhenVisible, canHover, ensureSources]);

  const playing = hasVideo && ((active && canHover) || visibleActive);

  return (
    <div ref={wrapRef} className={[styles.wrap, className ?? ""].join(" ")} data-playing={playing ? "true" : "false"}>
      <picture className={styles.poster}>
        <source media="(max-width: 640px)" srcSet={media.poster.mobile} />
        <img
          src={media.poster.desktop}
          alt=""
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
      {hasVideo ? (
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          data-loaded="false"
          onError={() => setBroken(true)}
        />
      ) : null}
    </div>
  );
}
