"use client";

import { experiences } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { fitnessContent as c } from "@/content/fitness";
import { ScrollChapter } from "@/components/motion/ScrollChapter";
import { SequenceCanvas } from "@/components/motion/SequenceCanvas";
import { SceneOverlay, OverlayItem } from "@/components/motion/SceneOverlay";
import { ProgressHUD } from "@/components/motion/ProgressHUD";
import { ScrubPoster } from "@/components/motion/ScrubPoster";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/ui/ContactForm";
import { FictionalNotice } from "@/components/ui/FictionalNotice";
import { FICTIONAL_LABEL } from "@/content/experiences";
import shared from "../shared.module.css";
import styles from "./Fitness.module.css";

const exp = experiences[7]!;
const media = mediaManifest.fitness;

export function FitnessExperience() {
  return (
    <>
      <ScrollChapter height={media.hero.scrollHeight} label={`${exp.brand} — magnésie`} id="magnesie" className={[shared.hero, styles.hero].join(" ")}>
        <SequenceCanvas media={media.hero} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <ProgressHUD label="Intensité" format={(p) => `${Math.round(p * 100)} %`} align="right" />
        <SceneOverlay className={styles.overlay}>
          <div className={styles.titleZone}>
            <p className="eyebrow eyebrow--gold">
              Expérience {exp.number} · {exp.sector} · {FICTIONAL_LABEL}
            </p>
            <h1 className={styles.logo}>FORGE</h1>
            <OverlayItem from={0.04} to={0.32} fade={0.3} as="p" className={styles.motto}>
              {c.motto}
            </OverlayItem>
            <OverlayItem from={0.08} to={0.32} fade={0.3} as="p" className={shared.sub}>
              Salle de force premium. Faites défiler : le nuage de magnésie se déploie avec vous.
            </OverlayItem>
          </div>
          {c.philosophy.map((line, i) => {
            const from = 0.36 + i * 0.14;
            return (
              <OverlayItem key={line} from={from} to={1} fade={0.12} shift={18} as="p" className={[styles.line, i === c.philosophy.length - 1 ? styles.lineAccent : ""].join(" ")} style={{ ["--line" as string]: i }}>
                {line}
              </OverlayItem>
            );
          })}
          <OverlayItem from={0.9} to={1} fade={0.5} className={styles.heroCta}>
            <a href="#programmes" className="btn btn--accent">
              Voir les programmes
            </a>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section id="programmes" className={[shared.section, styles.programs].join(" ")} aria-labelledby="programs-title">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Programmes
          </Reveal>
          <Reveal delay={80}>
            <h2 id="programs-title" className="h2">
              Force · Conditionnement · Équipe
            </h2>
          </Reveal>
          <ul className={[shared.scroller, styles.programList].join(" ")} aria-label="Programmes (glisser sur mobile)">
            {c.programs.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 80} className={styles.program}>
                <span className={styles.programLevel}>{p.level}</span>
                <h3 className={styles.programTitle}>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ScrollChapter height={240} label="The Iron" id="iron" className={shared.hero}>
        <ScrubPoster poster={media.stills.iron ?? media.hero.poster} range={[0, 1]} scale={[1.05, 1.2]} pan={[3, -3]} fade={0.06} />
        <div className={shared.sceneShade} aria-hidden="true" />
        <SceneOverlay>
          <OverlayItem from={0.05} to={0.95} fade={0.25} className={shared.chapterLabel}>
            <p className="eyebrow" style={{ color: exp.accent }}>
              The Iron
            </p>
            <h2>Le grip, la barre, les mains.</h2>
            <p>Travelling macro le long d’une barre chargée. Aucun effet : la matière suffit.</p>
          </OverlayItem>
        </SceneOverlay>
      </ScrollChapter>

      <section className={[shared.section, styles.coaches].join(" ")} aria-labelledby="coaches-title">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Coachs
          </Reveal>
          <Reveal delay={80}>
            <h2 id="coaches-title" className="h2">
              Trois profils conceptuels.
            </h2>
          </Reveal>
          <Reveal as="p" className="lead" delay={140}>
            Aucune identité réelle n’est inventée : ces profils illustrent la mise en page. Ils seront remplacés par l’équipe réelle du client.
          </Reveal>
          <ul className={shared.cardGrid}>
            {c.coaches.map((co, i) => (
              <Reveal as="li" key={co.id} delay={i * 80} className={[shared.card, styles.coach].join(" ")}>
                <span className={styles.coachAvatar} aria-hidden="true">
                  {co.name.slice(-1)}
                </span>
                <h3>{co.name}</h3>
                <p className={styles.coachRole}>{co.role}</p>
                <p>{co.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={[shared.section, styles.results].join(" ")} aria-label="Résultats de démonstration">
        <picture className={styles.resultsBg}>
          <source media="(max-width: 640px)" srcSet={media.stills.grind?.mobile} />
          <img src={media.stills.grind?.desktop} alt="" loading="lazy" decoding="async" />
        </picture>
        <div className="container">
          <Reveal as="p" className="eyebrow" style={{ color: exp.accent }}>
            The Grind · résultats de démonstration
          </Reveal>
          <Reveal delay={80}>
            <ul className="facts">
              {c.results.map((r) => (
                <li key={r.label}>
                  <strong>{r.value}</strong>
                  <span>{r.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className={shared.demoNote}>Chiffres fictifs : aucune mesure réelle n’a été effectuée.</p>
        </div>
      </section>

      <section id="tarifs" className={[shared.section, styles.pricing].join(" ")} aria-labelledby="fitness-pricing">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Tarifs
          </Reveal>
          <Reveal delay={80}>
            <h2 id="fitness-pricing" className="h2">
              Trois offres. Aucun engagement caché.
            </h2>
          </Reveal>
          <ul className={shared.cardGrid}>
            {c.pricing.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 90} className={[shared.card, p.featured ? shared.cardFeatured : ""].join(" ")}>
                <h3>{p.name}</h3>
                <p className={shared.price}>{p.price}</p>
                <p className={shared.priceNote}>{p.period}</p>
                <ul className={shared.cardList}>
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href="#inscription" className={["btn", p.featured ? "btn--accent" : "btn--ghost"].join(" ")}>
                  Choisir {p.name}
                </a>
              </Reveal>
            ))}
          </ul>
          <p className={shared.demoNote}>Tarifs fictifs, présentés à titre de démonstration.</p>
        </div>
      </section>

      <section className={[shared.section, styles.schedule].join(" ")} aria-labelledby="schedule-title">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Planning
          </Reveal>
          <Reveal delay={80}>
            <h2 id="schedule-title" className="h2">
              La semaine, en fer.
            </h2>
          </Reveal>
          <div className={styles.scheduleWrap}>
            <table className={styles.scheduleTable}>
              <caption className="visually-hidden">Planning hebdomadaire de démonstration</caption>
              <thead>
                <tr>
                  {c.schedule.map((d) => (
                    <th key={d.day} scope="col">
                      {d.day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {c.schedule.map((d) => (
                    <td key={d.day}>
                      <ul>
                        {d.slots.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="inscription" className={[shared.section, styles.form].join(" ")} aria-labelledby="join-title">
        <div className="container">
          <div className={shared.split}>
            <div className={shared.splitA}>
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Inscription
              </Reveal>
              <Reveal delay={80}>
                <h2 id="join-title" className="h2">
                  Earn it. Dès demain.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <div className={styles.map} role="img" aria-label="Plan stylisé fictif indiquant l’emplacement de la salle.">
                  <svg viewBox="0 0 400 220" aria-hidden="true">
                    <rect width="400" height="220" fill="#0e0e10" />
                    <g stroke="rgba(244,240,232,0.12)" strokeWidth="6" fill="none">
                      <path d="M0 60 H400" />
                      <path d="M0 150 H400" />
                      <path d="M90 0 V220" />
                      <path d="M300 0 V220" />
                    </g>
                    <circle cx="200" cy="105" r="18" fill="none" stroke="#e23b3b" strokeWidth="2" />
                    <circle cx="200" cy="105" r="6" fill="#e23b3b" />
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
                  context="forge-inscription"
                  submitLabel="Demander un essai"
                  showBudget={false}
                  messageLabel="Votre objectif"
                  mailtoSubject="FORGE — essai (démonstration)"
                  extraFields={[{ name: "programme", label: "Programme", type: "select", options: c.programs.map((p) => p.title) }]}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
