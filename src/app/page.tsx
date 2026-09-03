import Link from "next/link";
import { HomeHero } from "@/components/experiences/HomeHero";
import { Manifesto } from "@/components/experiences/Manifesto";
import { ExperienceIndex } from "@/components/experiences/ExperienceIndex";
import { ContactCTA } from "@/components/ui/ContactCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { services, methodSteps } from "@/content/services";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Manifesto />
      <ExperienceIndex />
      <section className={["section", "section--far", styles.expertise].join(" ")} aria-labelledby="home-expertise">
        <div className="container">
          <div className="two-col">
            <div className="col-a">
              <SectionHeading eyebrow="EXPERTISE" title={<span id="home-expertise">Une vision complète, de l’idée à la mise en ligne.</span>} />
              <Reveal delay={200} className={styles.moreLink}>
                <Link href="/expertise" className="link-arrow">
                  Découvrir l’expertise
                </Link>
              </Reveal>
            </div>
            <ul className={["col-b", styles.serviceList].join(" ")}>
              {services.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 70} className={styles.service}>
                  <span className="numeral">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="h3">{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className={["section", "section--far", styles.method].join(" ")} aria-labelledby="home-method">
        <div className="container">
          <SectionHeading eyebrow="MÉTHODE" title={<span id="home-method">Chaque mouvement commence par une intention.</span>} />
          <ol className={styles.steps}>
            {methodSteps.map((m, i) => (
              <Reveal as="li" key={m.number} delay={i * 80} className={styles.step}>
                <span className="numeral">{m.number}</span>
                <h3 className="h3">{m.title}</h3>
                <p>{m.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className={styles.moreLink} delay={300}>
            <Link href="/methode" className="link-arrow">
              Lire la méthode
            </Link>
          </Reveal>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
