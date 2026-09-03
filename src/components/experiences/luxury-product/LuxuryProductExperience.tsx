"use client";

import { useEffect, useRef } from "react";
import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { ScrollChapter, useChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { SceneLayer } from "@/components/motion/SceneLayer";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { FICTIONAL_LABEL } from "@/content/experiences";
import { ExplodedWatch } from "./ExplodedWatch";
import shared from "../shared.module.css";
import styles from "./LuxuryProduct.module.css";

const exp = experiences[2]!;
const media = mediaManifest["luxury-product"];

/** Nom de marque massif dont le tracking se resserre avec la progression. */
function TrackedBrand({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { subscribe, isStatic } = useChapter();
  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    if (!el) return;
    return subscribe((p) => {
      const t = Math.min(1, p / 0.3);
      const tracking = 0.42 - t * 0.4;
      el.style.letterSpacing = `${tracking.toFixed(3)}em`;
      el.style.opacity = Math.min(1, 0.4 + t).toFixed(3);
    });
  }, [subscribe, isStatic]);
  return (
    <span ref={ref} className={styles.tracked}>
      {text}
    </span>
  );
}

const callouts = [
  { at: [0.1, 0.32] as [number, number], value: "42 mm", label: "Diamètre du boîtier", pos: styles.calloutA },
  { at: [0.28, 0.5] as [number, number], value: "Titane grade 5", label: "Boîtier brossé noir", pos: styles.calloutB },
  { at: [0.5, 0.72] as [number, number], value: "72 h", label: "Réserve de marche", pos: styles.calloutC },
  { at: [0.68, 0.9] as [number, number], value: "217 composants", label: "Mouvement manufacture", pos: styles.calloutD },
];

export function LuxuryProductExperience() {
  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label={`${exp.brand} — orbite de la montre Eclipse`} id="orbite" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <ProgressHUD label="Rotation" format={(p) => `${Math.round(p * 360)}°`} align="right" />
        <SceneOverlay>
          <div className={shared.titleBlock}>
            <p className="eyebrow eyebrow--gold">
              Expérience {exp.number} · {exp.sector} · {FICTIONAL_LABEL}
            </p>
            <h1 className={styles.h1}>
              <TrackedBrand text="AURUM & NOIR" />
            </h1>
            <OverlayItem from={0.06} to={0.4} fade={0.25} as="p" className={shared.hook}>
              Eclipse · Tourbillon chronographe
            </OverlayItem>
            <OverlayItem from={0.1} to={0.4} fade={0.25} as="p" className={shared.sub}>
              Faites défiler pour faire tourner la montre. Remontez pour inverser la rotation.
            </OverlayItem>
          </div>
          <OverlayItem from={0.45} to={0.75} fade={0.25} className={shared.chapterLabelRight}>
            <p className="eyebrow eyebrow--gold">Crafted in Darkness.</p>
            <h2>Une géométrie parfaitement constante.</h2>
            <p>Une seule image maîtresse, une rotation studio à 360°, aucune dérive de forme entre les plans.</p>
          </OverlayItem>
          <OverlayItem from={0.82} to={1} fade={0.35} className={shared.titleBlock}>
            <p className={shared.finalFacts}>
              <span>Édition de 88</span>
              <span>48 000 $</span>
            </p>
            <div className={shared.actions}>
              <a href="#liste-privee" className="btn btn--accent">
                Rejoindre la liste privée
              </a>
            </div>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.crafted].join(" ")} aria-labelledby="crafted-title">
        <span className="halo" style={{ width: 520, height: 520, right: "-10%", top: "10%", background: "radial-gradient(circle, rgba(200,169,107,0.25), rgba(200,169,107,0) 70%)" }} aria-hidden="true" />
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Crafted in Darkness
              </Reveal>
              <Reveal delay={80}>
                <h2 id="crafted-title" className="h1">
                  Le noir n’est pas une absence. C’est une matière.
                </h2>
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal as="p" className="lead" delay={140}>
                Titane brossé noir, saphir bombé, tourbillon champagne visible à six heures. L’Eclipse ne cherche pas la lumière : elle la retient. Chaque surface est pensée pour n’en renvoyer qu’un filet.
              </Reveal>
              <Reveal as="p" className="lead" delay={200} style={{ marginTop: "1rem" }}>
                Sur le site, la même retenue : un vide noir, un seul objet, et un mouvement qui n’appartient qu’au visiteur.
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ScrollChapter height={280} label="Macro sur le cadran" id="macro" className={shared.hero}>
        <SceneLayer media={media.scenes.macro} fallbackPoster={media.stills.macro ?? media.hero.poster} scale={[1.05, 1.4]} pan={[-2, 2]} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <SceneOverlay>
          <OverlayItem from={0} to={0.4} fade={0.3} className={shared.chapterLabel}>
            <p className="eyebrow eyebrow--gold">Macro fly-through</p>
            <h2>Index, tourbillon, métal brossé.</h2>
            <p>Un travelling macro scrubé : le visiteur avance dans la matière à la vitesse de son geste.</p>
          </OverlayItem>
          <OverlayItem from={0.5} to={1} fade={0.3} className={shared.chapterLabelRight}>
            <p className="eyebrow eyebrow--gold">Verre saphir</p>
            <h2>Un dôme, une seule réflexion.</h2>
            <p>Traitement antireflet double face. Le cadran reste lisible sous n’importe quel angle.</p>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <ScrollChapter height={340} label="Vue éclatée" id="eclatee" className={[shared.hero, styles.explodedChapter].join(" ")}>
        <div className={styles.explodedStage} aria-hidden="false">
          <ExplodedWatch />
        </div>
        <ProgressHUD label="Assemblage" format={(p) => (p < 0.5 ? `${Math.round((p / 0.5) * 100)} % éclaté` : `${Math.round((1 - (p - 0.5) / 0.5) * 100)} % éclaté`)} />
        <SceneOverlay>
          <OverlayItem from={0} to={0.14} fade={0.4} className={shared.chapterLabel}>
            <p className="eyebrow eyebrow--gold">Exploded assembly</p>
            <h2>Se décomposer, puis se recomposer.</h2>
            <p>Six composants séparés selon un axe plausible, suspendus, puis réassemblés au rythme du scroll.</p>
          </OverlayItem>
          {callouts.map((cItem) => (
            <OverlayItem key={cItem.value} from={cItem.at[0]} to={cItem.at[1]} fade={0.25} className={[shared.callout, cItem.pos].join(" ")}>
              <strong>{cItem.value}</strong>
              {cItem.label}
            </OverlayItem>
          ))}
          <OverlayItem from={0.9} to={1} fade={0.4} className={shared.chapterLabel}>
            <p className="eyebrow eyebrow--gold">Réassemblée</p>
            <h2>217 composants. Un seul geste.</h2>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section id="liste-privee" className={[shared.section, styles.list].join(" ")} aria-labelledby="list-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Liste privée
              </Reveal>
              <Reveal delay={80}>
                <h2 id="list-title" className="h2">
                  Édition de 88 · 48 000 $
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={140}>
                Chaque pièce est numérotée et attribuée sur invitation. Laissez vos coordonnées pour recevoir le dossier de présentation.
              </Reveal>
              <Reveal delay={200}>
                <FictionalNotice note="AURUM & NOIR, la montre Eclipse, ses caractéristiques, l’édition et le prix sont fictifs. Ce formulaire illustre un parcours de liste privée." />
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal delay={120}>
                <ContactForm context="aurum-noir-liste-privee" submitLabel="Rejoindre la liste privée" showBudget={false} messageLabel="Votre message" mailtoSubject="AURUM & NOIR — liste privée (démonstration)" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
