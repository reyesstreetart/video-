import type { Metadata } from "next";
import { PageIntro } from "@/components/ui/PageIntro";
import { siteConfig, hasValue } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site MV Design : éditeur, hébergement, propriété intellectuelle et statut des concepts expérimentaux.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

const Todo = ({ label }: { label: string }) => <span className="todo">À compléter : {label}</span>;

export default function MentionsLegalesPage() {
  const { legal, contact } = siteConfig;
  return (
    <>
      <PageIntro eyebrow="INFORMATIONS" title="Mentions légales" text="Informations relatives à l’éditeur et à l’hébergement de ce site." />
      <section className="section section--tight">
        <div className="container prose">
          <h2>Éditeur</h2>
          <p>
            {siteConfig.legalName}
            {hasValue(legal.companyForm) ? ` — ${legal.companyForm}` : null}
          </p>
          {hasValue(legal.siren) ? <p>SIREN : {legal.siren}</p> : <p><Todo label="numéro SIREN / SIRET" /></p>}
          {hasValue(legal.vat) ? <p>TVA intracommunautaire : {legal.vat}</p> : null}
          {hasValue(contact.address) ? (
            <p>
              {contact.address}
              {hasValue(contact.city) ? `, ${contact.city}` : null}
            </p>
          ) : (
            <p><Todo label="adresse du siège" /></p>
          )}
          {hasValue(contact.email) ? <p>Contact : {contact.email}</p> : <p><Todo label="adresse e-mail de contact" /></p>}
          <h2>Directeur de la publication</h2>
          <p>{hasValue(legal.publisher) ? legal.publisher : <Todo label="nom du directeur de la publication" />}</p>
          <h2>Hébergement</h2>
          <p>{hasValue(legal.hostingProvider) ? `${legal.hostingProvider}${hasValue(legal.hostingAddress) ? ` — ${legal.hostingAddress}` : ""}` : <Todo label="hébergeur et adresse" />}</p>
          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus de ce site (textes, images, films, code, interfaces) est la propriété de {siteConfig.legalName} ou de ses partenaires et ne peut être reproduit sans autorisation écrite.
          </p>
          <h2>Concepts expérimentaux</h2>
          <p>
            Les huit expériences présentées (ABYSSAL, AURUM &amp; NOIR, EMBER &amp; OAK, THE MERIDIAN, VANTA, PULSE, FORGE et la démonstration de portfolio) sont des concepts expérimentaux MV Design. Les marques, produits, biens, prix, dates, chiffres et profils sont fictifs et ne constituent ni une offre commerciale ni une référence client.
          </p>
        </div>
      </section>
    </>
  );
}
