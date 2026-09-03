"use client";

import { useEffect, useRef } from "react";
import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { saasContent as c } from "@/content/saas";
import { ScrollChapter, useChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { Reveal } from "@/components/motion/Reveal";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { FICTIONAL_LABEL } from "@/content/experiences";
import { easeInOut } from "@/lib/utils";
import { DashboardMock } from "./DashboardMock";
import shared from "../shared.module.css";
import styles from "./Saas.module.css";

const exp = experiences[6]!;
const media = mediaManifest.saas;

/** Le dashboard HTML s'assemble panneau par panneau avec la progression (0.3 → 0.8). */
function AssemblingDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const { subscribe, isStatic } = useChapter();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    if (isStatic) {
      el.style.opacity = "1";
      panels.forEach((p) => {
        p.style.opacity = "1";
        p.style.transform = "none";
      });
      return;
    }
    return subscribe((p) => {
      const global = Math.min(1, Math.max(0, (p - 0.25) / 0.2));
      el.style.opacity = easeInOut(global).toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - easeInOut(global)) * 40).toFixed(1)}px, 0) scale(${(0.96 + 0.04 * easeInOut(global)).toFixed(3)})`;
      panels.forEach((panel, i) => {
        const start = 0.34 + i * 0.09;
        const t = easeInOut(Math.min(1, Math.max(0, (p - start) / 0.12)));
        panel.style.opacity = t.toFixed(3);
        panel.style.transform = `translate3d(0, ${((1 - t) * 24).toFixed(1)}px, 0)`;
      });
    });
  }, [subscribe, isStatic]);
  return (
    <div ref={ref} className={styles.assembling}>
      <DashboardMock assembling />
    </div>
  );
}

export function SaasExperience() {
  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label={`${exp.brand} — assemblage du dashboard`} id="assemblage" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} range={[0, 0.6]} dim={(p) => Math.min(0.75, Math.max(0, (p - 0.3) / 0.4) * 0.75)} />
        <div className={styles.stage}>
          <AssemblingDashboard />
        </div>
        <ProgressHUD label="Assemblage" format={(p) => `${Math.round(Math.min(1, Math.max(0, (p - 0.25) / 0.55)) * 100)} %`} align="right" />
        <SceneOverlay className={styles.overlay}>
          <OverlayItem from={0} to={0.3} fade={0.35} className={styles.titleZone}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              Expérience {exp.number} · {exp.sector} · {FICTIONAL_LABEL}
            </p>
            <h1 className={styles.h1}>{c.h1}</h1>
            <p className={shared.sub}>{c.sub}</p>
            <div className={shared.actions}>
              <a href="#tarifs" className="btn" style={{ ["--btn-bg" as string]: exp.accent, ["--btn-fg" as string]: "#fff", ["--btn-border" as string]: exp.accent }}>
                Commencer gratuitement
              </a>
            </div>
          </OverlayItem>
          <OverlayItem from={0.84} to={1} fade={0.4} className={styles.bottomNote}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              Interface réelle · HTML/CSS
            </p>
            <p className={shared.sub}>Aucun texte généré : ce que vous voyez est un vrai composant, lisible et indexable.</p>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.light, styles.features].join(" ")} aria-labelledby="features-title">
        <div className="container">
          <Reveal as="p" className={["eyebrow", styles.eyebrowDark].join(" ")}>
            Trois fonctions
          </Reveal>
          <Reveal delay={80}>
            <h2 id="features-title" className="h2">
              Prédire · Expliquer · Prévenir
            </h2>
          </Reveal>
          <ul className={styles.featureList}>
            {c.features.map((f, i) => (
              <Reveal as="li" key={f.id} delay={i * 120} className={styles.feature}>
                <span className={styles.featureIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={[shared.section, styles.light, styles.metrics].join(" ")} aria-label="Métriques de démonstration">
        <div className="container">
          <Reveal>
            <ul className={styles.metricList}>
              {c.metrics.map((m) => (
                <li key={m.label}>
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className={styles.demoNoteDark}>Données de démonstration : ces métriques n’ont pas été mesurées sur un produit réel.</p>
        </div>
      </section>

      <section className={[shared.section, styles.light, styles.screenshot].join(" ")} aria-labelledby="screenshot-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className={["eyebrow", styles.eyebrowDark].join(" ")}>
                The Calm
              </Reveal>
              <Reveal delay={80}>
                <h2 id="screenshot-title" className="h2">
                  Un dashboard qui se lit en dix secondes.
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={140}>
                Trois indicateurs, une courbe, une liste d’actions. Le reste attend derrière un clic.
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal delay={120}>
                <DashboardMock light />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="tarifs" className={[shared.section, styles.light, styles.pricing].join(" ")} aria-labelledby="pricing-title">
        <div className="container">
          <Reveal as="p" className={["eyebrow", styles.eyebrowDark].join(" ")}>
            Tarifs
          </Reveal>
          <Reveal delay={80}>
            <h2 id="pricing-title" className="h2">
              Trois offres. Une seule promesse.
            </h2>
          </Reveal>
          <ul className={styles.plans}>
            {c.pricing.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 90} className={[styles.plan, p.featured ? styles.planFeatured : ""].join(" ")}>
                {p.featured ? <span className={styles.planBadge}>Recommandé</span> : null}
                <h3 className="h3">{p.name}</h3>
                <p className={styles.planPrice}>
                  {p.price} <span>{p.period}</span>
                </p>
                <ul className={styles.planList}>
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href="#faq" className={["btn", p.featured ? "" : "btn--ghost", styles.planCta].join(" ")}>
                  {p.cta}
                </a>
              </Reveal>
            ))}
          </ul>
          <p className={styles.demoNoteDark}>Tarifs fictifs, présentés à titre de démonstration.</p>
        </div>
      </section>

      <section id="faq" className={[shared.section, styles.light, styles.faqSection].join(" ")} aria-labelledby="faq-title">
        <div className="container">
          <Reveal as="p" className={["eyebrow", styles.eyebrowDark].join(" ")}>
            FAQ
          </Reveal>
          <Reveal delay={80}>
            <h2 id="faq-title" className="h2">
              Questions fréquentes.
            </h2>
          </Reveal>
          <ul className={[shared.faq, styles.faq].join(" ")}>
            {c.faq.map((f) => (
              <li key={f.q}>
                <details>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              </li>
            ))}
          </ul>
          <div className={styles.finalCta}>
            <Reveal>
              <a href="#assemblage" className="btn" style={{ ["--btn-bg" as string]: exp.accent, ["--btn-fg" as string]: "#fff", ["--btn-border" as string]: exp.accent }}>
                Commencer gratuitement
              </a>
            </Reveal>
            <Reveal delay={80}>
              <FictionalNotice note={exp.fictionalNote} className={styles.noticeDark} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
