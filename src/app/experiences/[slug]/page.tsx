import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experienceBySlug, experienceSlugs, nextExperience, type ExperienceSlug } from "@/content/experiences";
import { mediaManifest } from "@/content/media-manifest";
import { siteConfig } from "@/content/site-config";
import { KnowHowSection } from "@/components/ui/KnowHowSection";
import { NextExperience } from "@/components/ui/NextExperience";
import { PreloadNextPoster } from "@/components/experiences/PreloadNextPoster";
import { DeepSeaExperience } from "@/components/experiences/deep-sea/DeepSeaExperience";
import { PortfolioExperience } from "@/components/experiences/portfolio/PortfolioExperience";
import { LuxuryProductExperience } from "@/components/experiences/luxury-product/LuxuryProductExperience";
import { RestaurantExperience } from "@/components/experiences/restaurant/RestaurantExperience";
import { RealEstateExperience } from "@/components/experiences/real-estate/RealEstateExperience";
import { AutomotiveExperience } from "@/components/experiences/automotive/AutomotiveExperience";
import { SaasExperience } from "@/components/experiences/saas/SaasExperience";
import { FitnessExperience } from "@/components/experiences/fitness/FitnessExperience";

interface Params {
  slug: string;
}

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return experienceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const exp = experienceBySlug(slug);
  if (!exp) return {};
  const media = mediaManifest[exp.slug];
  return {
    title: exp.metaTitle,
    description: exp.metaDescription,
    alternates: { canonical: `/experiences/${exp.slug}` },
    openGraph: {
      title: `${exp.metaTitle} · MV Design`,
      description: exp.metaDescription,
      url: `${siteConfig.url}/experiences/${exp.slug}`,
      images: [{ url: media.poster.desktop, width: 1280, height: 720, alt: `${exp.brand} — ${exp.concept}` }],
    },
  };
}

const components: Record<ExperienceSlug, React.ComponentType> = {
  "deep-sea-journey": DeepSeaExperience,
  "personal-portfolio": PortfolioExperience,
  "luxury-product": LuxuryProductExperience,
  restaurant: RestaurantExperience,
  "real-estate": RealEstateExperience,
  automotive: AutomotiveExperience,
  saas: SaasExperience,
  fitness: FitnessExperience,
};

export default async function ExperiencePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const exp = experienceBySlug(slug);
  if (!exp) notFound();
  const Component = components[exp.slug];
  const next = nextExperience(exp.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${exp.sector} — ${exp.concept}`,
    description: exp.metaDescription,
    creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    genre: "Concept expérimental",
    url: `${siteConfig.url}/experiences/${exp.slug}`,
  };
  return (
    <article data-experience={exp.slug} style={{ ["--scene-accent" as string]: exp.accent, ["--scene-accent-soft" as string]: exp.accentSoft }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Component />
      <KnowHowSection experience={exp} />
      <NextExperience next={next} />
      <PreloadNextPoster href={mediaManifest[next.slug].poster.desktop} />
    </article>
  );
}
