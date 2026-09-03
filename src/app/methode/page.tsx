import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { ContactCTA } from "@/components/ui/ContactCTA";
import { Reveal } from "@/components/motion/Reveal";
import { methodIntro, methodSteps } from "@/content/services";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Méthode",
  description: "Cadrer, écrire, produire, développer, éprouver : la méthode MV Design pour transformer une ambition en expérience web maîtrisée.",
  alternates: { canonical: "/methode" },
};

const principles = [
  { title: "Scroll natif, toujours", text: "Aucun scroll-lock, aucun faux défilement. La molette, le trackpad, la scrollbar, le clavier et le toucher restent souverains." },
  { title: "Réversibilité", text: "Chaque scène avance et recule immédiatement. Un rechargement en milieu de scène retrouve la bonne image." },
  { title: "Poster d’abord", text: "Aucun loader bloquant. L’image maîtresse s’affiche tout de suite, la séquence se décode ensuite." },
  { title: "Trois modes", text: "Full, lite et static : chaque appareil, chaque préférence de mouvement et chaque connexion reçoit une version cohérente." },
  { title: "Honnêteté du contenu", text: "Les concepts expérimentaux sont signalés. Aucun chiffre, client ou témoignage n’est fabriqué." },
  { title: "Budgets tenus", text: "Poids des médias, LCP, CLS et INP sont des contraintes de conception, pas des ajustements de dernière minute." },
];

export default function MethodePage() {
  return (
    <>
      <PageIntro eyebrow={methodIntro.eyebrow} title={methodIntro.title} text={methodIntro.text} />
      <section className="section section--tight" aria-label="Les cinq étapes">
        <div className="container">
          <ol className={styles.steps}>
            {methodSteps.map((m, i) => (
              <Reveal as="li" key={m.number} delay={i * 80} className={styles.step}>
                <span className={styles.number}>{m.number}</span>
                <div>
                  <h2 className="h2">{m.title}</h2>
                  <p className="lead">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section className="section section--far" aria-labelledby="principles-title">
        <div className="container">
          <Reveal as="p" className="eyebrow eyebrow--gold">
            Principes
          </Reveal>
          <Reveal delay={80}>
            <h2 id="principles-title" className="h2">
              Ce que nous ne négocions pas.
            </h2>
          </Reveal>
          <ul className={styles.principles}>
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 60} className={styles.principle}>
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
