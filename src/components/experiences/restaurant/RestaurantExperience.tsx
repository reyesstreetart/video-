"use client";

import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { restaurantContent as c } from "@/content/restaurant";
import { ScrollChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { ScrubPoster } from "@/components/motion/ScrubPoster";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { ExperienceHeroTitle } from "../ExperienceHeroTitle";
import shared from "../shared.module.css";
import styles from "./Restaurant.module.css";

const exp = experiences[3]!;
const media = mediaManifest.restaurant;

function MenuColumn({ title, items }: { title: string; items: { name: string; detail: string; price: string }[] }) {
  return (
    <div className={styles.menuCol}>
      <h3 className={styles.menuTitle}>{title}</h3>
      <ul className={styles.menuList}>
        {items.map((it, i) => (
          <Reveal as="li" key={it.name} delay={i * 70} className={styles.menuItem}>
            <div>
              <span className={styles.dish}>{it.name}</span>
              <span className={styles.detail}>{it.detail}</span>
            </div>
            <span className={styles.price}>{it.price} €</span>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function RestaurantExperience() {
  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label={`${exp.brand} — le feu`} id="feu" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <ProgressHUD label="Braise" format={(p) => `${Math.round(280 + p * 520)} °C`} align="right" />
        <SceneOverlay>
          <OverlayItem from={0} to={0.3} fade={0.3}>
            <ExperienceHeroTitle
              number={exp.number}
              sector={exp.sector}
              brand={
                <>
                  EMBER <span className={styles.amp}>&amp;</span> OAK
                </>
              }
              hook="Wood fire. Nothing else."
              sub="Steakhouse au feu de bois. Faites défiler pour approcher la flamme."
              actions={
                <a href="#reservation" className="btn btn--accent">
                  Réserver une table
                </a>
              }
            />
          </OverlayItem>
          <OverlayItem from={0.38} to={0.68} fade={0.3} className={shared.chapterLabelRight}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              Le geste
            </p>
            <h2>Saisir. Attendre. Retourner une fois.</h2>
            <p>Macro slow motion scrubée : la flamme avance à la vitesse de votre geste.</p>
          </OverlayItem>
          <OverlayItem from={0.74} to={1} fade={0.35} className={shared.chapterLabel}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              {c.story.title}
            </p>
            <h2>Une braise stable à dix-neuf heures.</h2>
            <div className={shared.actions}>
              <a href="#menu" className="btn btn--accent">
                Voir le menu
              </a>
            </div>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.story].join(" ")} aria-labelledby="story-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Histoire courte
              </Reveal>
              <Reveal delay={80}>
                <h2 id="story-title" className="h1">
                  {c.story.title}
                </h2>
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal as="p" className="lead" delay={140}>
                {c.story.text}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className={[shared.section, styles.menu].join(" ")} aria-labelledby="menu-title">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Menu éditorial
          </Reveal>
          <Reveal delay={80}>
            <h2 id="menu-title" className="h2">
              Feu / Terre
            </h2>
          </Reveal>
          <div className={styles.menuGrid}>
            <MenuColumn title={c.menu.fire.title} items={c.menu.fire.items} />
            <MenuColumn title={c.menu.earth.title} items={c.menu.earth.items} />
          </div>
          <p className={shared.demoNote}>Carte et prix fictifs, présentés à titre de démonstration.</p>
        </div>
      </section>

      <ScrollChapter height={260} label="Repas privé" id="table-du-chef" className={shared.hero}>
        <ScrubPoster poster={media.stills.craft ?? media.hero.poster} range={[0, 1]} scale={[1.05, 1.18]} pan={[0, -2]} fade={0.06} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <SceneOverlay>
          <OverlayItem from={0} to={0.5} fade={0.3} className={shared.chapterLabel}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              The Craft
            </p>
            <h2>{c.privateDining.title}</h2>
            <p>{c.privateDining.text}</p>
          </OverlayItem>
          <OverlayItem from={0.55} to={1} fade={0.3} className={shared.chapterLabelRight}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              Repas privé
            </p>
            <h2>Huit couverts. Un seul menu.</h2>
            <div className={shared.actions}>
              <a href="#reservation" className="btn btn--accent">
                Réserver la table du chef
              </a>
            </div>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.room].join(" ")} aria-labelledby="room-title">
        <div className="container">
          <div className={shared.split}>
            <figure className={[shared.figure, shared.splitB].join(" ")}>
              <picture>
                <source media="(max-width: 640px)" srcSet={media.stills.room?.mobile} />
                <img src={media.stills.room?.desktop} alt="Salle conceptuelle d’EMBER & OAK : cuir, bougies, bar en arrière-plan." loading="lazy" decoding="async" />
              </picture>
              <figcaption>The Room · placeholder</figcaption>
            </figure>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                La salle
              </Reveal>
              <Reveal delay={80}>
                <h2 id="room-title" className="h2">
                  Cuir, chêne, bougies. Et le foyer, toujours visible.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <dl className={styles.hours}>
                  {c.hours.map((h) => (
                    <div key={h.day}>
                      <dt>{h.day}</dt>
                      <dd>{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="reservation" className={[shared.section, styles.reservation].join(" ")} aria-labelledby="reservation-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Réservation
              </Reveal>
              <Reveal delay={80}>
                <h2 id="reservation-title" className="h2">
                  Réserver une table.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <div className={styles.map} role="img" aria-label="Plan stylisé fictif indiquant l’emplacement du restaurant.">
                  <svg viewBox="0 0 400 260" aria-hidden="true">
                    <rect width="400" height="260" fill="#0a0906" />
                    <g stroke="rgba(244,240,232,0.14)" strokeWidth="6" fill="none">
                      <path d="M0 80 H400" />
                      <path d="M0 170 H400" />
                      <path d="M120 0 V260" />
                      <path d="M260 0 V260" />
                    </g>
                    <path d="M0 220 Q200 190 400 230" stroke="rgba(255,122,47,0.35)" strokeWidth="10" fill="none" />
                    <circle cx="190" cy="125" r="18" fill="none" stroke="#ff7a2f" strokeWidth="2" />
                    <circle cx="190" cy="125" r="6" fill="#ff7a2f" />
                  </svg>
                  <span className={styles.mapLabel}>{c.address}</span>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <FictionalNotice note={exp.fictionalNote} />
              </Reveal>
            </div>
            <div className={shared.splitB}>
              <Reveal delay={120}>
                <ContactForm
                  context="ember-oak-reservation"
                  submitLabel="Réserver une table"
                  showBudget={false}
                  messageLabel="Précisions (allergies, occasion, table du chef)"
                  mailtoSubject="EMBER & OAK — réservation (démonstration)"
                  extraFields={[
                    { name: "date", label: "Date", type: "date", required: true },
                    { name: "heure", label: "Heure", type: "time", required: true },
                    { name: "couverts", label: "Nombre de personnes", type: "number", min: 1, max: 12, required: true },
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
