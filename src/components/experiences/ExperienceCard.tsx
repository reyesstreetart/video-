"use client";

import Link from "next/link";
import { useState } from "react";
import type { Experience } from "@/content/experiences";
import { FICTIONAL_LABEL } from "@/content/experiences";
import type { PreviewMedia } from "@/content/media-manifest";
import { VideoPreview } from "@/components/motion/VideoPreview";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./ExperienceCard.module.css";

interface ExperienceCardProps {
  experience: Experience;
  media: PreviewMedia;
  index: number;
  /** Lecture automatique sur mobile lorsque la carte est majoritairement visible. */
  autoplayWhenVisible?: boolean;
  priority?: boolean;
}

/**
 * Carte animée de l'index : numéro, secteur, concept, phrase, poster + preview légère.
 * Preview lancée au hover (pointer fin) ou au focus clavier ; sur mobile, une seule carte visible joue.
 */
export function ExperienceCard({ experience, media, index, autoplayWhenVisible = true, priority = false }: ExperienceCardProps) {
  const [active, setActive] = useState(false);
  const href = `/experiences/${experience.slug}`;
  const reversed = index % 2 === 1;

  return (
    <Reveal
      as="li"
      className={[styles.card, reversed ? styles.reversed : ""].join(" ")}
      style={{ ["--scene-accent" as string]: experience.accent }}
      delay={40}
    >
      <article
        className={styles.article}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocusCapture={() => setActive(true)}
        onBlurCapture={() => setActive(false)}
        data-active={active ? "true" : "false"}
      >
        <Link href={href} className={styles.mediaLink} tabIndex={-1} aria-hidden="true">
          <VideoPreview media={media} active={active} autoplayWhenVisible={autoplayWhenVisible} className={styles.media} priority={priority} />
          <span className={styles.numberBig} aria-hidden="true">
            {experience.number}
          </span>
        </Link>
        <div className={styles.body}>
          <p className={styles.meta}>
            <span className="numeral">{experience.number}</span>
            <span className={styles.sector}>{experience.sector}</span>
          </p>
          <h3 className={["h3", styles.title].join(" ")}>
            <Link href={href} className={styles.titleLink}>
              {experience.indexTitle}
            </Link>
          </h3>
          <p className={styles.summary}>{experience.summary}</p>
          <p className={styles.brand}>
            {experience.brand} · {experience.concept}
          </p>
          <div className={styles.foot}>
            <Link href={href} className="link-arrow">
              Traverser l’expérience
            </Link>
            <span className="demo-tag">{FICTIONAL_LABEL}</span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
