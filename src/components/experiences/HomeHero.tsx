"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { ScrollChapter, useChapter } from "@/components/motion/ScrollChapter";
import { useMotionMode } from "@/components/motion/MotionModeProvider";
import { easeInOut } from "@/lib/utils";
import styles from "./HomeHero.module.css";

const posters = experiences.map((e) => ({ slug: e.slug, src: mediaManifest[e.slug].poster.desktop, accent: e.accent }));

/**
 * Hero principal : le monogramme MV agit comme un masque contenant un montage des huit univers.
 * Au premier scroll, le masque s'ouvre puis révèle l'index. Poster immédiat, aucun loader bloquant.
 */
function HeroScene() {
  const maskRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const montageRef = useRef<HTMLDivElement>(null);
  const monoRef = useRef<HTMLSpanElement>(null);
  const { subscribe, isStatic } = useChapter();
  const { mode } = useMotionMode();

  useEffect(() => {
    if (isStatic) return;
    const mask = maskRef.current;
    const text = textRef.current;
    const hint = hintRef.current;
    const montage = montageRef.current;
    if (!mask || !text || !hint || !montage) return;
    return subscribe((p) => {
      // 0 → 0.55 : le masque grandit jusqu'au plein écran ; 0.55 → 1 : fondu vers l'index.
      const open = easeInOut(Math.min(1, p / 0.55));
      const scale = 1 + open * 14;
      mask.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      if (monoRef.current) monoRef.current.style.opacity = (1 - Math.min(1, p / 0.18)).toFixed(3);
      const textOut = Math.min(1, p / 0.35);
      text.style.opacity = (1 - textOut).toFixed(3);
      text.style.transform = `translate3d(0, ${(-textOut * 40).toFixed(1)}px, 0)`;
      hint.style.opacity = (1 - Math.min(1, p / 0.12)).toFixed(3);
      const fadeOut = p > 0.7 ? Math.min(1, (p - 0.7) / 0.3) : 0;
      montage.style.opacity = (1 - fadeOut).toFixed(3);
      montage.style.visibility = fadeOut >= 1 ? "hidden" : "visible";
    });
  }, [subscribe, isStatic]);

  return (
    <div className={styles.scene} data-mode={mode}>
      <div ref={montageRef} className={styles.montageLayer}>
        <div ref={maskRef} className={styles.mask} aria-hidden="true">
          <div className={styles.montage}>
            {posters.map((p, i) => (
              <img key={p.slug} src={p.src} alt="" className={styles.slide} style={{ ["--i" as string]: i }} decoding="async" loading={i === 0 ? "eager" : "lazy"} fetchPriority={i === 0 ? "high" : "auto"} />
            ))}
          </div>
          <span ref={monoRef} className={styles.monogramText}>
            MV
          </span>
        </div>
      </div>
      <span className="halo" style={{ width: 720, height: 720, left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.55 }} aria-hidden="true" />
      <div ref={textRef} className={styles.text}>
        <p className="eyebrow eyebrow--gold">STUDIO DIGITAL · DESIGN, MOTION &amp; DÉVELOPPEMENT</p>
        <h1 className={["display", styles.title].join(" ")}>
          Des sites que l’on ne fait pas défiler.
          <br />
          <em>On les traverse.</em>
        </h1>
        <p className={["lead", styles.intro].join(" ")}>
          MV Design conçoit des expériences web immersives où l’image, le mouvement et la technologie donnent à chaque marque une présence impossible à confondre.
        </p>
        <div className={styles.actions}>
          <Link href="#experiences" className="btn btn--primary">
            Explorer les 8 expériences
          </Link>
          <Link href="/contact" className="btn btn--ghost">
            Présenter mon projet
          </Link>
        </div>
      </div>
      <p ref={hintRef} className={styles.hint} aria-hidden="true">
        <span>Entrer dans l’expérience</span>
        <span className={styles.hintLine} />
      </p>
    </div>
  );
}

export function HomeHero() {
  return (
    <ScrollChapter height={220} label="Introduction MV Design" id="hero" className={styles.chapter}>
      <HeroScene />
    </ScrollChapter>
  );
}
