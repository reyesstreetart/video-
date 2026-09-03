import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";

export default function NotFound() {
  return (
    <PageIntro eyebrow="ERREUR 404" title="Cette page n’existe pas." text="Le lien est peut-être erroné, ou la page a été déplacée.">
      <p style={{ marginTop: "2rem" }}>
        <Link href="/" className="btn btn--primary">
          Retour à l’accueil
        </Link>
      </p>
    </PageIntro>
  );
}
