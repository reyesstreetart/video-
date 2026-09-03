import type { ReactNode } from "react";
import { FICTIONAL_LABEL } from "@/content/experiences";
import styles from "./shared.module.css";

interface ExperienceHeroTitleProps {
  number: string;
  sector: string;
  brand: ReactNode;
  hook?: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  brandClassName?: string;
}

/** Bloc titre commun aux héros : surtitre, marque (H1), accroche, sous-titre et CTA. */
export function ExperienceHeroTitle({ number, sector, brand, hook, sub, actions, align = "left", className, brandClassName }: ExperienceHeroTitleProps) {
  const cls = align === "right" ? styles.titleBlockRight : align === "center" ? styles.titleBlockCenter : styles.titleBlock;
  return (
    <div className={[cls, className ?? ""].join(" ")}>
      <p className="eyebrow eyebrow--gold">
        Expérience {number} · {sector} · {FICTIONAL_LABEL}
      </p>
      <h1 className={[styles.brand, brandClassName ?? ""].join(" ")}>{brand}</h1>
      {hook ? <p className={styles.hook}>{hook}</p> : null}
      {sub ? <p className={styles.sub}>{sub}</p> : null}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}
