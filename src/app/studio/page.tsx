import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactCTA } from "@/components/ui/ContactCTA";
import { Reveal } from "@/components/motion/Reveal";
import { studioIntro } from "@/content/services";
import { siteConfig } from "@/content/site-config";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Studio",
  description: "MV Design est un studio web indépendant spécialisé dans les expériences digitales haut de gamme, à la rencontre du design et de la technologie.",
  alternates: { canonical: "/studio" },
};

const values = [
  { title: "Indépendance", text: "Un studio à taille humaine, des interlocuteurs directs, aucune couche intermédiaire entre l’intention et l’exécution." },
  { title: "Exigence", text: "La même attention pour un hero cinématique et pour un formulaire de contact accessible." },
  { title: "Transparence", text: "Des concepts expérimentaux clairement signalés, des chiffres uniquement réels, des budgets annoncés." },
];

export default function StudioPage() {
  const { proof } = siteConfig;
  return (
    <>
      <PageIntro eyebrow={studioIntro.eyebrow} title={studioIntro.title} text={studioIntro.text} />
      <section className="section section--tight" aria-labelledby="values-title">
        <div className="container">
          <div className="two-col">
            <div className="col-a">
              <Reveal as="p" className="eyebrow eyebrow--gold">
                Le studio
              </Reveal>
              <Reveal delay={80}>
                <h2 id="values-title" className="h2">
                  Design, mouvement et code, sous le même toit.
                </h2>
              </Reveal>
            </div>
            <ul className={["col-b", styles.values].join(" ")}>
              {values.map((v, i) => (
                <Reveal as="li" key={v.title} delay={i * 80} className={styles.value}>
                  <h3 className="h3">{v.title}</h3>
                  <p>{v.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {proof.stats.length ? (
        <section className="section section--tight" aria-label="Chiffres clés">
          <div className="container">
            <ul className="facts">
              {proof.stats.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {proof.clients.length ? (
        <section className="section section--tight" aria-labelledby="clients-title">
          <div className="container">
            <h2 id="clients-title" className="eyebrow eyebrow--gold">
              Ils nous font confiance
            </h2>
            <ul className={styles.clients}>
              {proof.clients.map((c) => (
                <li key={c.name}>{c.name}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {proof.testimonials.length ? (
        <section className="section section--tight" aria-labelledby="testimonials-title">
          <div className="container">
            <h2 id="testimonials-title" className="eyebrow eyebrow--gold">
              Témoignages
            </h2>
            <ul className={styles.testimonials}>
              {proof.testimonials.map((t) => (
                <li key={t.author}>
                  <blockquote>
                    <p>{t.quote}</p>
                    <footer>
                      {t.author}
                      {t.role ? ` · ${t.role}` : ""}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section section--far" aria-labelledby="studio-experiences">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Portfolio
          </Reveal>
          <Reveal delay={80}>
            <h2 id="studio-experiences" className="h2">
              Le site que vous parcourez est notre portfolio.
            </h2>
          </Reveal>
          <Reveal as="p" className="lead" delay={140}>
            Plutôt que des captures d’écran, huit expériences complètes à traverser. Chacune est un concept expérimental signalé comme tel : aucune n’est présentée comme un client réel.
          </Reveal>
          <Reveal delay={200} className={styles.moreLink}>
            <Link href="/experiences" className="btn btn--ghost">
              Voir les huit expériences
            </Link>
          </Reveal>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
