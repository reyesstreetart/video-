"use client";

import { useCallback, useState } from "react";
import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { automotiveContent as c } from "@/content/automotive";
import { ScrollChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { ExperienceHeroTitle } from "../ExperienceHeroTitle";
import shared from "../shared.module.css";
import styles from "./Automotive.module.css";

const exp = experiences[5]!;
const media = mediaManifest.automotive;

/** Courbe de vitesse : accélération rapide, plateau, mode nuit plus calme. */
const speedFor = (p: number) => {
  if (p < 0.2) return 0;
  if (p < 0.55) return Math.round(((p - 0.2) / 0.35) * c.maxSpeed);
  if (p < 0.78) return c.maxSpeed;
  return Math.round(c.maxSpeed - ((p - 0.78) / 0.22) * 130);
};

/** Teaser configurateur : trois teintes appliquées sur une même image (fond + halo), sans 3D. */
function Configurator() {
  const [active, setActive] = useState(c.colors[0]!);
  return (
    <div className={styles.configurator}>
      <div className={styles.configStage} style={{ ["--car-color" as string]: active.hex, ["--car-glow" as string]: active.glow }}>
        <img src={media.stills.reveal?.desktop} alt={`VANTA en teinte ${active.label} (rendu conceptuel)`} loading="lazy" decoding="async" />
        <span className={styles.tint} aria-hidden="true" />
        <span className={styles.glow} aria-hidden="true" />
      </div>
      <div className={styles.swatches} role="radiogroup" aria-label="Teinte de carrosserie">
        {c.colors.map((col) => (
          <button
            key={col.id}
            type="button"
            role="radio"
            aria-checked={active.id === col.id}
            className={styles.swatch}
            onClick={() => setActive(col)}
            style={{ ["--swatch" as string]: col.hex }}
          >
            <span className={styles.swatchDot} aria-hidden="true" />
            {col.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AutomotiveExperience() {
  const formatSpeed = useCallback((p: number) => `${speedFor(p)} mph`, []);
  const steps = c.environments.map((e) => ({ at: e.at, label: e.label }));

  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label={`${exp.brand} — parcours`} id="parcours" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <ProgressHUD label="Vitesse" format={formatSpeed} steps={steps} align="right" />
        <SceneOverlay>
          <OverlayItem from={0} to={0.22} fade={0.3}>
            <ExperienceHeroTitle
              number={exp.number}
              sector={exp.sector}
              brand="VANTA"
              hook={exp.hook}
              sub="Hypercar électrique. Faites défiler pour conduire à travers quatre environnements. Remontez pour revenir au départ."
              actions={
                <a href="#reservation" className="btn btn--accent">
                  Réserver · dépôt {c.deposit}
                </a>
              }
            />
          </OverlayItem>
          {c.environments.slice(1).map((e, i) => {
            const to = c.environments[i + 2]?.at ?? 1;
            return (
              <OverlayItem key={e.id} from={e.at + 0.02} to={to - 0.02} fade={0.28} className={i % 2 === 0 ? shared.chapterLabel : shared.chapterLabelRight}>
                <p className="eyebrow" style={{ color: exp.accent }}>
                  {e.label}
                </p>
                <h2>{e.title}</h2>
                <p>{e.text}</p>
              </OverlayItem>
            );
          })}
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.counters].join(" ")} aria-label="Performances">
        <div className="container">
          <Reveal>
            <ul className="facts">
              {c.counters.map((k) => (
                <li key={k.label}>
                  <strong>{k.value}</strong>
                  <span>{k.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className={shared.demoNote}>Compteurs fictifs, présentés à titre de démonstration.</p>
        </div>
      </section>

      <section className={[shared.section, styles.stills].join(" ")} aria-labelledby="design-title">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Design
          </Reveal>
          <Reveal delay={80}>
            <h2 id="design-title" className="h2">
              Bas, large, noir sur noir.
            </h2>
          </Reveal>
          <ul className={shared.gallery}>
            {c.stills.map((s, i) => (
              <Reveal as="li" key={s.still} delay={i * 80}>
                <figure className={shared.galleryItem}>
                  <div className={shared.galleryMedia}>
                    <img src={media.stills[s.still]?.desktop} alt={`Still conceptuel : ${s.caption}`} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>{s.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={[shared.section, styles.night].join(" ")} aria-labelledby="night-title">
        <picture className={styles.nightBg}>
          <source media="(max-width: 640px)" srcSet={media.stills.night?.mobile} />
          <img src={media.stills.night?.desktop} alt="" loading="lazy" decoding="async" />
        </picture>
        <div className="container">
          <div className={shared.finalBlock}>
            <Reveal as="p" className="eyebrow" style={{ color: exp.accent }}>
              Night Mode
            </Reveal>
            <Reveal delay={80}>
              <h2 id="night-title" className="h1">
                La nuit, tout s’éteint. Sauf l’essentiel.
              </h2>
            </Reveal>
            <Reveal as="p" className="lead" delay={140}>
              Instruments assombris, signature lumineuse au minimum, 1 200 ch en silence. Le mode nuit est un état d’esprit autant qu’un réglage.
            </Reveal>
          </div>
        </div>
      </section>

      <section className={[shared.section, styles.config].join(" ")} aria-labelledby="config-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Configurateur · teaser
              </Reveal>
              <Reveal delay={80}>
                <h2 id="config-title" className="h2">
                  Trois teintes, une image cohérente.
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={140}>
                Sans rendu 3D : la même image maîtresse, teintée et éclairée différemment. Assez pour choisir, pas assez pour alourdir.
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal delay={120}>
                <Configurator />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="reservation" className={[shared.section, styles.form].join(" ")} aria-labelledby="reserve-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Réservation
              </Reveal>
              <Reveal delay={80}>
                <h2 id="reserve-title" className="h2">
                  Réserver · dépôt {c.deposit}
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={140}>
                Dépôt remboursable, priorité de production, configuration finale à la commande.
              </Reveal>
              <Reveal delay={200}>
                <FictionalNotice note={exp.fictionalNote} />
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal delay={120}>
                <ContactForm context="vanta-reservation" submitLabel="Réserver ma VANTA (démo)" showBudget={false} messageLabel="Votre message" mailtoSubject="VANTA — réservation (démonstration)" extraFields={[{ name: "teinte", label: "Teinte", type: "select", options: c.colors.map((col) => col.label) }]} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
