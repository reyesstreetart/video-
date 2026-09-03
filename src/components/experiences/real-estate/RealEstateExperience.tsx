"use client";

import { useCallback } from "react";
import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { realEstateContent as c } from "@/content/real-estate";
import { ScrollChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { ExperienceHeroTitle } from "../ExperienceHeroTitle";
import shared from "../shared.module.css";
import styles from "./RealEstate.module.css";

const exp = experiences[4]!;
const media = mediaManifest["real-estate"];

export function RealEstateExperience() {
  const formatStage = useCallback((p: number) => {
    let current = c.stages[0]!;
    for (const s of c.stages) if (p >= s.at) current = s;
    return current.label;
  }, []);
  const steps = c.stages.map((s) => ({ at: s.at, label: s.label }));

  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label={`${exp.brand} — visite continue`} id="visite" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <ProgressHUD label="Visite" format={formatStage} steps={steps} />
        <SceneOverlay>
          <OverlayItem from={0} to={0.2} fade={0.3}>
            <ExperienceHeroTitle
              number={exp.number}
              sector={exp.sector}
              brand="THE MERIDIAN"
              hook={exp.hook}
              sub={`Penthouse de ${c.price} au ${c.floor}. Faites défiler pour entrer. Remontez pour revenir à la ville.`}
              actions={
                <a href="#visite-privee" className="btn btn--accent">
                  Demander une visite privée
                </a>
              }
            />
          </OverlayItem>
          {c.stages.slice(1).map((s, i) => {
            const from = s.at;
            const to = c.stages[i + 2]?.at ?? 1;
            const Cls = i % 2 === 0 ? shared.chapterLabelRight : shared.chapterLabel;
            return (
              <OverlayItem key={s.id} from={from + 0.02} to={to - 0.02} fade={0.28} className={Cls}>
                <p className="eyebrow" style={{ color: exp.accent }}>
                  {s.label}
                </p>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </OverlayItem>
            );
          })}
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.facts].join(" ")} aria-label="Caractéristiques">
        <div className="container">
          <Reveal>
            <ul className="facts">
              {c.facts.map((f) => (
                <li key={f.label}>
                  <strong>{f.value}</strong>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className={[shared.section, styles.gallery].join(" ")} aria-labelledby="gallery-title">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Galerie
          </Reveal>
          <Reveal delay={80}>
            <h2 id="gallery-title" className="h2">
              Quatre plans chaînés, une seule architecture.
            </h2>
          </Reveal>
          <ul className={shared.gallery}>
            {c.gallery.map((g, i) => (
              <Reveal as="li" key={g.still} delay={i * 80}>
                <figure className={shared.galleryItem}>
                  <div className={shared.galleryMedia}>
                    <img src={media.stills[g.still]?.desktop} alt={`Vue conceptuelle : ${g.caption}`} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>{g.caption}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={[shared.section, styles.amenities].join(" ")} aria-labelledby="amenities-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Équipements
              </Reveal>
              <Reveal delay={80}>
                <h2 id="amenities-title" className="h2">
                  Tout, soixante étages plus haut.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className={styles.price}>{c.price}</p>
              </Reveal>
            </div>
            <ul className={[shared.splitB, styles.amenityList].join(" ")}>
              {c.amenities.map((a, i) => (
                <Reveal as="li" key={a} delay={i * 40}>
                  {a}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="visite-privee" className={[shared.section, styles.form].join(" ")} aria-labelledby="visit-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Visite privée
              </Reveal>
              <Reveal delay={80}>
                <h2 id="visit-title" className="h2">
                  Demander une visite privée.
                </h2>
              </Reveal>
              <Reveal as="p" className="lead" delay={140}>
                Un conseiller vous rappelle pour convenir d’un créneau. Visite sur rendez-vous uniquement.
              </Reveal>
              <Reveal delay={200}>
                <FictionalNotice note={exp.fictionalNote} />
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal delay={120}>
                <ContactForm
                  context="meridian-visite-privee"
                  submitLabel="Demander une visite privée"
                  showBudget={false}
                  messageLabel="Votre message"
                  mailtoSubject="THE MERIDIAN — visite privée (démonstration)"
                  extraFields={[
                    { name: "telephone", label: "Téléphone", type: "text" },
                    { name: "creneau", label: "Créneau souhaité", type: "select", options: ["Matin", "Après-midi", "Soir"] },
                  ]}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
