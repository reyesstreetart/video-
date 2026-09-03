import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";
import styles from "./PageIntro.module.css";

interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
}

/** En-tête des pages éditoriales (expertise, méthode, studio, contact, légal). */
export function PageIntro({ eyebrow, title, text, children }: PageIntroProps) {
  return (
    <section className={styles.intro}>
      <span className="halo" style={{ width: 520, height: 520, top: -200, right: "-10%" }} aria-hidden="true" />
      <div className="container">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} as="h1" size="h1" />
        {children}
      </div>
    </section>
  );
}
