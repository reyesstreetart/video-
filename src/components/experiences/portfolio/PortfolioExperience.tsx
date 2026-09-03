"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { portfolioContent } from "@/content/portfolio";
import { ScrollChapter, useChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { ScrubPoster } from "@/components/motion/ScrubPoster";
import { Reveal } from "@/components/motion/Reveal";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { FICTIONAL_LABEL } from "@/content/experiences";
import shared from "../shared.module.css";
import styles from "./Portfolio.module.css";

const exp = experiences[1]!;
const media = mediaManifest["personal-portfolio"];
const c = portfolioContent;

/** Nom monumental entrant lettre par lettre, piloté par la progression. */
function LetterName({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { subscribe, isStatic } = useChapter();
  const letters = Array.from(name);
  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-letter]"));
    return subscribe((p) => {
      // Entrée : 0.02 → 0.22 ; sortie : 0.3 → 0.4
      spans.forEach((s, i) => {
        const start = 0.02 + (i / spans.length) * 0.18;
        const t = Math.min(1, Math.max(0, (p - start) / 0.06));
        const out = Math.min(1, Math.max(0, (p - 0.3) / 0.1));
        const o = t * (1 - out);
        s.style.opacity = o.toFixed(3);
        s.style.transform = `translate3d(0, ${((1 - t) * 30).toFixed(1)}px, 0)`;
      });
    });
  }, [subscribe, isStatic]);
  return (
    <span ref={ref} className={styles.name} aria-label={name}>
      {letters.map((l, i) => (
        <span key={i} data-letter aria-hidden="true" className={l === " " ? styles.space : undefined} style={isStatic ? { opacity: 1 } : undefined}>
          {l === " " ? " " : l}
        </span>
      ))}
    </span>
  );
}

export function PortfolioExperience() {
  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label="Portrait en orbite" id="orbite" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <ProgressHUD label="Orbite" format={(p) => `${Math.round(p * 360)}°`} align="right" />
        <SceneOverlay className={styles.overlay}>
          <div className={styles.titleZone}>
            <p className="eyebrow eyebrow--gold">
              Expérience {exp.number} · {exp.sector} · {FICTIONAL_LABEL}
            </p>
            <h1 className={styles.h1}>
              <LetterName name={c.persona.name} />
              <span className="visually-hidden"> — {c.persona.role}</span>
            </h1>
            <OverlayItem from={0.14} to={0.4} fade={0.25} as="p" className={shared.hook}>
              {c.persona.role}
            </OverlayItem>
          </div>
          <OverlayItem from={0.42} to={0.72} fade={0.25} className={shared.chapterLabel}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              L’activité en une phrase
            </p>
            <h2>{c.persona.activity}</h2>
            <p>{c.persona.location}</p>
          </OverlayItem>
          <OverlayItem from={0.76} to={1} fade={0.3} className={styles.finalOverlay}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              Une orbite complète
            </p>
            <p className={shared.sub}>Identité, présence et réalisations se révèlent autour d’un portrait central. La suite se lit vers le bas.</p>
            <div className={shared.actions}>
              <a href="#piliers" className="btn btn--accent">
                Découvrir les trois piliers
              </a>
            </div>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      {c.stats.length ? (
        <section className={[shared.section, styles.stats].join(" ")} aria-label="Chiffres clés">
          <div className="container">
            <ul className="facts">
              {c.stats.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ScrollChapter height={300} label="Les trois piliers" id="piliers" className={shared.hero}>
        <ScrubPoster poster={media.stills.builder ?? media.hero.poster} range={[0, 1]} scale={[1.06, 1.16]} pan={[1.5, -1.5]} fade={0.06} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <SceneOverlay>
          <OverlayItem from={0} to={0.22} fade={0.35} className={shared.chapterLabel}>
            <p className="eyebrow eyebrow--gold">The Builder</p>
            <h2>Trois piliers, révélés un à un.</h2>
          </OverlayItem>
          {c.pillars.map((p, i) => {
            const from = 0.22 + i * 0.26;
            return (
              <OverlayItem key={p.title} from={from} to={from + 0.26} fade={0.3} className={shared.chapterLabel}>
                <p className="eyebrow" style={{ color: exp.accent }}>
                  Pilier {String(i + 1).padStart(2, "0")}
                </p>
                <h2>{p.title}</h2>
                <p>{p.text}</p>
              </OverlayItem>
            );
          })}
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.gallerySection].join(" ")} aria-labelledby="projects-title">
        <picture className={styles.galleryBg}>
          <source media="(max-width: 640px)" srcSet={media.stills.closer?.mobile} />
          <img src={media.stills.closer?.desktop} alt="" loading="lazy" decoding="async" />
        </picture>
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            The Closer
          </Reveal>
          <Reveal delay={80}>
            <h2 id="projects-title" className="h2">
              Trois projets, un mouvement au survol.
            </h2>
          </Reveal>
          <ul className={shared.gallery}>
            {c.projects.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80}>
                <figure className={[shared.galleryItem, styles.project].join(" ")}>
                  <div className={shared.galleryMedia}>
                    <img src={media.stills[p.still]?.desktop} alt={`Aperçu conceptuel du projet ${p.title}`} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>
                    <span className={styles.projectTitle}>{p.title}</span>
                    <span>
                      {p.sector} · {p.year}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={[shared.section, styles.cta].join(" ")} aria-labelledby="portfolio-cta">
        <div className="container">
          <div className={shared.finalBlock}>
            <Reveal delay={0}>
              <h2 id="portfolio-cta" className="h1">
                {c.cta.title}
              </h2>
            </Reveal>
            <Reveal as="p" className="lead" delay={80}>
              {c.cta.text}
            </Reveal>
            <Reveal className={shared.actions} delay={140}>
              <Link href={c.cta.href} className="btn btn--accent">
                {c.cta.label}
              </Link>
              {c.social.map((s) => (
                <a key={s.href} href={s.href} className="btn btn--ghost" rel="noopener noreferrer" target="_blank">
                  {s.label}
                </a>
              ))}
            </Reveal>
            <Reveal delay={200}>
              <FictionalNotice note={exp.fictionalNote} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
