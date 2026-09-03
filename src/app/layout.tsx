import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig, hasValue } from "@/content/site-config";
import { motionModeBootScript } from "@/lib/motion-mode";
import { MotionModeProvider } from "@/components/motion/MotionModeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { ConsentAnalytics } from "@/components/layout/ConsentAnalytics";
import "./globals.css";

const instrumentSerif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  fallback: ["Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

const manrope = localFont({
  src: [{ path: "../fonts/Manrope-Variable.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MV Design — Expériences web immersives",
    template: "%s · MV Design",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: siteConfig.name,
    title: "MV Design — Des sites que l’on ne fait pas défiler. On les traverse.",
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "MV Design" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#030817",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    areaServed: siteConfig.contact.country,
    ...(hasValue(siteConfig.contact.email) ? { email: siteConfig.contact.email } : {}),
    ...(hasValue(siteConfig.contact.phone) ? { telephone: siteConfig.contact.phone } : {}),
    ...(hasValue(siteConfig.contact.address)
      ? { address: { "@type": "PostalAddress", streetAddress: siteConfig.contact.address, addressLocality: siteConfig.contact.city, addressCountry: siteConfig.contact.country } }
      : {}),
    sameAs: Object.values(siteConfig.social).filter(hasValue),
    knowsAbout: ["Design web", "Motion design", "Développement front-end", "Expériences immersives"],
  };

  return (
    <html lang="fr" className={[instrumentSerif.variable, manrope.variable].join(" ")} data-motion="full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionModeBootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <MotionModeProvider>
          <SkipLink />
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ConsentAnalytics />
        </MotionModeProvider>
      </body>
    </html>
  );
}
