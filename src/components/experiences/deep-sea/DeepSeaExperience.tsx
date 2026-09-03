"use client";

import Link from "next/link";
import { useCallback } from "react";
import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { ScrollChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { ExperienceHeroTitle } from "../ExperienceHeroTitle";
import shared from "../shared.module.css";
import styles from "./DeepSea.module.css";

const exp = experiences[0]!;
const media = mediaManifest["deep-sea-journey"];
const MAX_DEPTH = 3800;

const zones = [
  { id: "surface", at: 0, depth: "0 m", label: "La surface", fact: "À l’aube, l’EREBUS quitte la lumière. Sous la surface, la température chute de 1 °C tous les 10 mètres.", range: [0.06, 0.2] as [number, number] },
  { id: "sunlit", at: 0.2, depth: "200 m", label: "Zone éclairée", fact: "90 % de la vie marine se concentre dans ces 200 premiers mètres, là où la photosynthèse reste possible.", range: [0.22, 0.38] as [number, number] },
  { id: "twilight", at: 0.4, depth: "1 000 m", label: "Zone crépusculaire", fact: "Le bleu s’éteint. Les projecteurs s’allument. Les méduses y produisent leur propre lumière pour survivre.", range: [0.42, 0.58] as [number, number] },
  { id: "midnight", at: 0.6, depth: "2 500 m", label: "Zone de minuit", fact: "Obscurité totale, pression de 250 bars. Ici, la bioluminescence est le seul langage.", range: [0.62, 0.78] as [number, number] },
  { id: "floor", at: 0.8, depth: "3 800 m", label: "Le fond", fact: "Les sources hydrothermales dépassent 350 °C et abritent des écosystèmes qui n’ont jamais vu le soleil.", range: [0.82, 0.94] as [number, number] },
];

const specs = [
  { value: "3 800 m", label: "Profondeur opérationnelle" },
  { value: "2 + 6", label: "Équipage et passagers" },
  { value: "96 h", label: "Autonomie vitale" },
  { value: "Titane", label: "Sphère habitable" },
];

export function DeepSeaExperience() {
  const formatDepth = useCallback((p: number) => `${new Intl.NumberFormat("fr-FR").format(Math.round(p * MAX_DEPTH))} m`, []);
  const steps = zones.map((z) => ({ at: z.at, label: z.label }));

  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label={`${exp.brand} — descente sous-marine`} id="descente" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <ProgressHUD label="Profondeur" format={formatDepth} steps={steps} />
        <SceneOverlay>
          <OverlayItem from={0} to={0.12} fade={0.35} shift={30}>
            <ExperienceHeroTitle
              number={exp.number}
              sector={exp.sector}
              brand={exp.brand}
              hook={exp.hook}
              sub="Une descente continue de la surface jusqu’à 3 800 mètres. Faites défiler pour plonger. Remontez pour retrouver la lumière."
              actions={
                <>
                  <a href="#manifeste" className="btn btn--accent">
                    Rejoindre le manifeste
                  </a>
                  <a href="#erebus" className="btn btn--ghost">
                    Découvrir l’EREBUS
                  </a>
                </>
              }
            />
          </OverlayItem>
          {zones.map((z) => (
            <OverlayItem key={z.id} from={z.range[0]} to={z.range[1]} fade={0.25} className={shared.chapterLabel} as="div">
              <p className="eyebrow" style={{ color: exp.accent }}>
                {z.depth}
              </p>
              <h2>{z.label}</h2>
              <p>{z.fact}</p>
            </OverlayItem>
          ))}
          <OverlayItem from={0.44} to={0.56} fade={0.3} className={[shared.callout, styles.calloutLights].join(" ")} staticVisible={false}>
            <strong>2 × 12 000 lm</strong>
            Projecteurs LED
          </OverlayItem>
          <OverlayItem from={0.64} to={0.76} fade={0.3} className={[shared.callout, styles.calloutHull].join(" ")} staticVisible={false}>
            <strong>Coque composite</strong>
            Anneau cyan · hublot 180°
          </OverlayItem>
          <OverlayItem from={0.9} to={1} fade={0.4} shift={20} className={styles.finalOverlay}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              Vous êtes au fond. 3 800 m.
            </p>
            <p className={shared.finalFacts}>
              <span>8 places</span>
              <span>250 000 $</span>
              <span>Départ mars 2027</span>
            </p>
            <a href="#manifeste" className="btn btn--accent">
              Rejoindre le manifeste
            </a>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.zones].join(" ")} aria-labelledby="zones-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Le voyage
              </Reveal>
              <Reveal delay={80}>
                <h2 id="zones-title" className="h2">
                  Cinq zones. Un seul plan-séquence.
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={140}>
                Chaque clip est chaîné au suivant par sa dernière frame. Le visiteur ne subit aucune coupure : il descend, puis remonte, à son rythme.
              </Reveal>
            </div>
            <ol className={[shared.splitB, styles.zoneList].join(" ")}>
              {zones.map((z, i) => (
                <Reveal as="li" key={z.id} delay={i * 70} className={styles.zoneItem}>
                  <span className={styles.zoneDepth}>{z.depth}</span>
                  <div>
                    <h3 className="h3">{z.label}</h3>
                    <p>{z.fact}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="erebus" className={[shared.section, styles.erebus].join(" ")} aria-labelledby="erebus-title">
        <div className="container">
          <div className={shared.split}>
            <figure className={[shared.figure, shared.splitB, styles.erebusFigure].join(" ")}>
              <picture>
                <source media="(max-width: 640px)" srcSet={media.stills.midnight?.mobile} />
                <img src={media.stills.midnight?.desktop} alt="Vue conceptuelle du submersible EREBUS entouré d’organismes bioluminescents." loading="lazy" decoding="async" />
              </picture>
              <figcaption>Image maîtresse · placeholder</figcaption>
            </figure>
            <div className={[shared.splitA, styles.erebusText].join(" ")}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Le submersible
              </Reveal>
              <Reveal delay={80}>
                <h2 id="erebus-title" className="h2">
                  EREBUS
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={140}>
                Coque noire profilée, anneau cyan autour du hublot, deux projecteurs. Une même image maîtresse réutilisée sur chaque génération pour garantir la continuité.
              </Reveal>
              <Reveal delay={200}>
                <ul className="facts">
                  {specs.map((s) => (
                    <li key={s.label}>
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="manifeste" className={[shared.section, styles.manifest].join(" ")} aria-labelledby="manifest-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Le manifeste
              </Reveal>
              <Reveal delay={80}>
                <h2 id="manifest-title" className="h2">
                  Jusqu’où irez-vous ?
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className={shared.finalFacts}>
                  <span>8 places</span>
                  <span>250 000 $</span>
                  <span>Départ mars 2027</span>
                </p>
              </Reveal>
              <Reveal delay={200}>
                <FictionalNotice note="ABYSSAL, l’EREBUS, les places, le tarif et la date de départ sont fictifs. Ce formulaire illustre un parcours de conversion : aucune expédition n’est proposée." />
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal delay={120}>
                <ContactForm context="abyssal-manifeste" submitLabel="Rejoindre le manifeste" showBudget={false} messageLabel="Votre motivation" mailtoSubject="ABYSSAL — manifeste (démonstration)" />
              </Reveal>
            </div>
          </div>
          <p className={styles.back}>
            <Link href="#descente" className="link-arrow">
              Remonter à la surface
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
