import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactForm } from "@/components/ui/ContactForm";
import { contactBlock } from "@/content/services";
import { siteConfig, hasValue } from "@/content/site-config";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact — Présenter mon projet",
  description: "Parlez-nous de votre univers, de votre ambition et de l’expérience que vous souhaitez faire vivre. Réponse personnalisée sous 48 heures ouvrées.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { contact, social } = siteConfig;
  const socials = Object.entries(social).filter(([, v]) => hasValue(v));
  const hasAnyContact = hasValue(contact.email) || hasValue(contact.phone) || hasValue(contact.whatsapp) || hasValue(contact.address) || socials.length > 0;
  return (
    <>
      <PageIntro eyebrow="CONTACT" title={contactBlock.title} text={contactBlock.text} />
      <section className="section section--tight" aria-label="Formulaire de contact" id="form">
        <div className="container">
          <div className="two-col">
            <div className={["col-a", styles.aside].join(" ")}>
              <p className="eyebrow eyebrow--gold">Ce que nous aimons savoir</p>
              <ul className={styles.hints}>
                <li>Votre secteur et votre positionnement.</li>
                <li>L’émotion ou l’action attendue du visiteur.</li>
                <li>Vos médias existants : photos, films, 3D, identité.</li>
                <li>Calendrier et budget envisagé, même approximatifs.</li>
              </ul>
              {hasAnyContact ? (
                <div className={styles.direct}>
                  <p className="eyebrow eyebrow--gold">En direct</p>
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
                    {socials.map(([k, v]) => (
                      <li key={k}>
                        <a href={v} rel="noopener noreferrer" target="_blank">
                          {k.charAt(0).toUpperCase() + k.slice(1)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className={styles.micro}>{siteConfig.responseTime}</p>
            </div>
            <div className="col-b">
              <ContactForm context="studio" submitLabel="Présenter mon projet" mailtoSubject="Projet MV Design" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
