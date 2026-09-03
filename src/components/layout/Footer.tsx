import Link from "next/link";
import { siteConfig, hasValue } from "@/content/site-config";
import { experiences } from "@/content/experiences";
import { Wordmark } from "./Wordmark";
import { MotionToggle } from "./MotionToggle";
import styles from "./Footer.module.css";

export function Footer() {
  const socials = Object.entries(siteConfig.social).filter(([, v]) => hasValue(v));
  const { contact } = siteConfig;
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Wordmark />
            <p className={styles.tagline}>{siteConfig.tagline}</p>
          </div>
          <nav className={styles.col} aria-label="Expériences">
            <h2 className={styles.heading}>Expériences</h2>
            <ul>
              {experiences.map((e) => (
                <li key={e.slug}>
                  <Link href={`/experiences/${e.slug}`}>
                    <span className="numeral">{e.number}</span> {e.sector}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className={styles.col} aria-label="Studio">
            <h2 className={styles.heading}>Studio</h2>
            <ul>
              {siteConfig.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/mentions-legales">Mentions légales</Link>
              </li>
              <li>
                <Link href="/confidentialite">Confidentialité</Link>
              </li>
            </ul>
          </nav>
          <div className={styles.col}>
            <h2 className={styles.heading}>Contact</h2>
            <ul>
              {hasValue(contact.email) ? (
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
              ) : null}
              {hasValue(contact.phone) ? (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
                </li>
              ) : null}
              {hasValue(contact.whatsapp) ? (
                <li>
                  <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {hasValue(contact.address) ? <li>{contact.address}</li> : null}
              {hasValue(contact.city) ? <li>{contact.city}</li> : null}
              {socials.map(([k, v]) => (
                <li key={k}>
                  <a href={v} rel="noopener noreferrer" target="_blank">
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </a>
                </li>
              ))}
              <li>
                <Link href="/contact" className="link-arrow">
                  Démarrer un projet
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Les huit expériences sont des concepts expérimentaux :
            marques, produits, prix et chiffres sont fictifs.
          </p>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
}
