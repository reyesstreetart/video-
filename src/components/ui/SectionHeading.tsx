import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  size?: "h1" | "h2" | "h3" | "display";
  className?: string;
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, text, as: Tag = "h2", align = "left", size = "h2", className, children }: SectionHeadingProps) {
  return (
    <div className={[styles.heading, align === "center" ? styles.center : "", className ?? ""].join(" ")}>
      {eyebrow ? (
        <Reveal as="p" className="eyebrow eyebrow--gold">
          {eyebrow}
        </Reveal>
      ) : null}
      <Reveal delay={80}>
        <Tag className={size}>{title}</Tag>
      </Reveal>
      {text ? (
        <Reveal as="p" className="lead" delay={160}>
          {text}
        </Reveal>
      ) : null}
      {children}
    </div>
  );
}
