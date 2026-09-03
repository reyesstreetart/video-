"use client";

import { useEffect, useRef, useState } from "react";
import type { SceneMedia, SequenceSource } from "@/content/media-manifest";
import { FrameLoader, loadPoster, type DecodedFrame } from "@/lib/media-loader";
import { isPortraitViewport, maxDevicePixelRatio } from "@/lib/motion-mode";
import { frameIndexFor } from "@/lib/scroll-progress";
import { useChapter } from "./ScrollChapter";
import { useMotionMode } from "./MotionModeProvider";
import { MotionFallback } from "./MotionFallback";
import styles from "./SequenceCanvas.module.css";

interface SequenceCanvasProps {
  media: SceneMedia;
  className?: string;
  /** Sous-plage de la progression du chapitre utilisée par cette séquence. */
  range?: [number, number];
  /** Assombrissement progressif (0..1) appliqué par-dessus, piloté par la progression. */
  dim?: (progress: number) => number;
}

type Drawable = DecodedFrame;

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: Drawable,
  cw: number,
  ch: number,
  focal: { x: number; y: number },
) {
  const iw = "naturalWidth" in img ? img.naturalWidth : img.width;
  const ih = "naturalHeight" in img ? img.naturalHeight : img.height;
  if (!iw || !ih) return;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) * focal.x;
  const dy = (ch - dh) * focal.y;
  ctx.drawImage(img, dx, dy, dw, dh);
}

/**
 * Canvas de séquence d'images piloté par la progression du chapitre.
 * - poster dessiné immédiatement, puis frames décodées
 * - dernière frame décodée conservée pendant le chargement (aucun écran noir)
 * - une seule séquence active par chapitre, suspension hors écran via le tracker
 * - bascule desktop/mobile sans flash
 */
export function SequenceCanvas({ media, className, range = [0, 1], dim }: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { subscribe, getProgress, isStatic } = useChapter();
  const { mode, degrade } = useMotionMode();
  const [failed, setFailed] = useState(false);
  const isPlaceholderOnly = !media.sequence;

  useEffect(() => {
    if (isStatic || failed || !media.sequence) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let destroyed = false;
    let loader: FrameLoader | null = null;
    let lastDrawn: Drawable | null = null;
    let poster: HTMLImageElement | null = null;
    let rafPending = false;
    let currentIndex = 0;
    let portrait = isPortraitViewport();
    let cssW = 0;
    let cssH = 0;
    let dpr = maxDevicePixelRatio(mode);
    const sequence = media.sequence;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = Math.max(1, Math.round(rect.width));
      cssH = Math.max(1, Math.round(rect.height));
      dpr = maxDevicePixelRatio(mode);
      const w = Math.round(cssW * dpr);
      const h = Math.round(cssH * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };

    const paint = () => {
      const img = lastDrawn ?? poster;
      if (!img) return;
      ctx.fillStyle = "#030817";
      ctx.fillRect(0, 0, cssW, cssH);
      drawCover(ctx, img, cssW, cssH, media.focal);
      if (dim) {
        const d = dim(getProgress());
        if (d > 0) {
          ctx.fillStyle = `rgba(3, 8, 23, ${Math.min(1, d).toFixed(3)})`;
          ctx.fillRect(0, 0, cssW, cssH);
        }
      }
    };

    const requestPaint = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        if (!destroyed) paint();
      });
    };

    const pickSource = (): SequenceSource => (portrait ? sequence.mobile : sequence.desktop);

    const startLoader = () => {
      const src = pickSource();
      const previous = loader;
      const next = new FrameLoader(src, {
        stride: mode === "lite" ? 2 : 1,
        concurrency: mode === "lite" ? 3 : 6,
        keepRadius: mode === "lite" ? 24 : 0,
        onFailure: (failures) => {
          if (failures >= 6 && !destroyed) {
            setFailed(true);
            degrade();
          }
        },
        onFrame: (index) => {
          if (index === currentIndex || !next.has(currentIndex)) {
            const f = next.get(currentIndex) ?? next.nearest(currentIndex);
            if (f) {
              lastDrawn = f;
              requestPaint();
            }
          }
          if (previous && !previous.has(index) && index === currentIndex) {
            previous.destroy();
          }
        },
      });
      loader = next;
      next.prime(currentIndex);
      // L'ancien loader reste dessiné jusqu'à la première frame du nouveau.
      if (previous) {
        const check = () => {
          if (destroyed) return;
          if (next.has(currentIndex) || next.nearest(currentIndex)) {
            previous.destroy();
          } else {
            setTimeout(check, 200);
          }
        };
        setTimeout(check, 200);
      }
    };

    const onProgress = (p: number) => {
      const local = Math.min(1, Math.max(0, (p - range[0]) / (range[1] - range[0])));
      const l = loader;
      if (!l) return;
      const index = l.normalize(frameIndexFor(local, l.frameCount));
      if (index !== currentIndex) {
        currentIndex = index;
        l.focus(index);
      }
      const frame = l.get(index) ?? l.nearest(index);
      if (frame) lastDrawn = frame;
      requestPaint();
    };

    const onOrientation = () => {
      const p = isPortraitViewport();
      if (p !== portrait) {
        portrait = p;
        startLoader();
      }
      resize();
    };

    // Poster d'abord : rendu immédiat.
    loadPoster(portrait ? media.poster.mobile : media.poster.desktop).then((img) => {
      if (destroyed) return;
      poster = img;
      if (!lastDrawn) requestPaint();
    });

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();
    startLoader();
    const unsub = subscribe(onProgress);
    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("resize", onOrientation);

    return () => {
      destroyed = true;
      unsub();
      ro.disconnect();
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("resize", onOrientation);
      loader?.destroy();
    };
  }, [media, mode, isStatic, failed, subscribe, getProgress, range, dim, degrade]);

  if (isStatic || failed || isPlaceholderOnly) {
    return <MotionFallback poster={media.poster} className={className} />;
  }

  return (
    <div className={[styles.wrap, className ?? ""].join(" ")} aria-hidden="true">
      <picture className={styles.poster}>
        <source media="(orientation: portrait) and (max-width: 899px)" srcSet={media.poster.mobile} />
        <img src={media.poster.desktop} alt="" decoding="async" fetchPriority="high" />
      </picture>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
