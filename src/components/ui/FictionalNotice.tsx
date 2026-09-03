import { FICTIONAL_LABEL } from "@/content/experiences";
import styles from "./FictionalNotice.module.css";

interface FictionalNoticeProps {
  note: string;
  className?: string;
  compact?: boolean;
}

/** Mention obligatoire : le concept n'est pas un vrai client. */
export function FictionalNotice({ note, className, compact = false }: FictionalNoticeProps) {
  return (
    <aside className={[styles.notice, compact ? styles.compact : "", className ?? ""].join(" ")} aria-label={FICTIONAL_LABEL}>
      <span className="demo-tag">{FICTIONAL_LABEL}</span>
      {!compact ? <p>{note}</p> : null}
    </aside>
  );
}
