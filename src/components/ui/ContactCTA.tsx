import Link from "next/link";
import { contactBlock } from "@/content/services";
import { siteConfig, hasValue } from "@/content/site-config";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./ContactCTA.module.css";

/** Bloc de contact final, présent sur les pages éditoriales et l'accueil. */
export function ContactCTA() {
  const email = siteConfig.contact.email;
  return (
    <section className={["section", styles.cta].join(" ")} aria-labelledby="contact-cta-title">
      <span className="halo" style={{ width: 640, height: 640, left: "-10%", bottom: "-30%" }} aria-hidden="true" />
      <div className="container">
        <div className={styles.inner}>
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Contact
          </Reveal>
          <Reveal delay={80}>
            <h2 id="contact-cta-title" className="h1">
              {contactBlock.title}
            </h2>
          </Reveal>
          <Reveal as="p" className="lead" delay={140}>
            {contactBlock.text}
          </Reveal>
          <Reveal className={styles.actions} delay={200}>
            <Link href={contactBlock.primary.href} className="btn btn--primary">
              {contactBlock.primary.label}
            </Link>
            {hasValue(email) ? (
              <a href={`mailto:${email}`} className="btn btn--ghost">
                {contactBlock.secondary.label}
              </a>
            ) : (
              <Link href="/contact#form" className="btn btn--ghost">
                {contactBlock.secondary.label}
              </Link>
            )}
          </Reveal>
          <Reveal as="p" className={styles.micro} delay={260}>
            {siteConfig.responseTime}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
