import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { siteConfig, hasValue } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Politique de confidentialité du site MV Design : données du formulaire de contact, mesure d’audience soumise à consentement, droits des personnes.",
  alternates: { canonical: "/confidentialite" },
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  const analytics = hasValue(process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL);
  return (
    <>
      <PageIntro eyebrow="INFORMATIONS" title="Politique de confidentialité" text="Ce que nous collectons, pourquoi, et comment exercer vos droits." />
      <section className="section section--tight">
        <div className="container prose">
          <h2>Formulaire de contact</h2>
          <p>
            Les informations saisies dans le formulaire (nom, e-mail, entreprise, budget, message et champs de démonstration) sont utilisées uniquement pour répondre à votre demande. Elles sont transmises par e-mail au studio et ne sont ni revendues ni utilisées à des fins publicitaires.
          </p>
          <p>Un champ invisible (honeypot) et une limitation du nombre d’envois protègent le formulaire contre les robots. Aucune donnée n’est stockée côté serveur au-delà de cette limitation temporaire.</p>
          <h2>Mesure d’audience</h2>
          {analytics ? (
            <p>Un outil de mesure d’audience est chargé uniquement après votre consentement explicite via le bandeau prévu à cet effet. Votre choix est mémorisé dans votre navigateur et peut être modifié en effaçant les données du site.</p>
          ) : (
            <p>Aucun outil de mesure d’audience n’est actuellement chargé sur ce site.</p>
          )}
          <h2>Stockage local</h2>
          <p>Le site mémorise localement votre préférence de mouvement (animations complètes, allégées ou désactivées). Cette information reste dans votre navigateur et n’est jamais transmise.</p>
          <h2>Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition.{" "}
            {hasValue(siteConfig.contact.email) ? (
              <>
                Écrivez-nous à <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
              </>
            ) : (
              <span className="todo">À compléter : adresse e-mail pour l’exercice des droits.</span>
            )}
          </p>
        </div>
      </section>
    </>
  );
}
