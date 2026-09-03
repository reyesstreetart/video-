import plan from "./media-plan.json";
import type { ExperienceSlug } from "./experiences";

/**
 * Manifeste média typé.
 * Source unique : `media-plan.json` (frames, versions, statut) + convention de nommage ci-dessous.
 * Remplacer un média = déposer les fichiers au bon chemin et mettre à jour le plan, sans toucher aux composants.
 *
 * Convention de chemins (public/media/<folder>/) :
 *   poster.webp / poster-mobile.webp                 → poster de la carte d'accueil
 *   preview.webm / preview.mp4                       → preview 3–5 s de l'accueil (desktop)
 *   preview-mobile.webm / preview-mobile.mp4         → preview 9:16 (optionnel)
 *   seq/<version>/desktop/NNN.webp                   → séquence hero desktop 16:9
 *   seq/<version>/mobile/NNN.webp                    → séquence hero mobile 9:16
 *   stills/<id>.webp / stills/<id>-mobile.webp       → posters des scènes secondaires
 *   hero.webm / hero.mp4 (optionnel)                 → alternative vidéo si la séquence n'est pas fournie
 */

export type MediaStatus = "placeholder" | "generated" | "missing";

export interface SequenceSource {
  /** Dossier public contenant les frames `000.webp`, `001.webp`… */
  dir: string;
  frameCount: number;
  width: number;
  height: number;
  extension: "webp" | "avif";
}

export interface PosterSource {
  desktop: string;
  mobile: string;
}

export interface VideoSource {
  webm?: string;
  mp4?: string;
}

export interface SceneMedia {
  id: string;
  status: MediaStatus;
  version: string;
  poster: PosterSource;
  sequence?: { desktop: SequenceSource; mobile: SequenceSource };
  video?: { desktop: VideoSource; mobile?: VideoSource };
  /** Point focal (0..1) protégé au recadrage. */
  focal: { x: number; y: number };
  /** Hauteur de scroll de la scène, en svh. */
  scrollHeight: number;
}

export interface PreviewMedia {
  status: MediaStatus;
  poster: PosterSource;
  video?: { desktop: VideoSource; mobile?: VideoSource };
  durationSeconds: number;
}

export interface ExperienceMedia {
  folder: string;
  /** Poster principal de l'expérience (carte, hero, OG image, expérience suivante). */
  poster: PosterSource;
  preview: PreviewMedia;
  hero: SceneMedia;
  stills: Record<string, PosterSource>;
  /** Scènes secondaires scrubées (macro, builder, craft…) : séquence si générée, sinon poster seul. */
  scenes: Record<string, SceneMedia>;
}

type PlanExperience = (typeof plan.experiences)[keyof typeof plan.experiences];

const frameName = (i: number, ext: string) => `${String(i).padStart(3, "0")}.${ext}`;

export const sequenceFrameUrl = (src: SequenceSource, index: number): string =>
  `${src.dir}/${frameName(index, src.extension)}`;

function buildExperienceMedia(slug: ExperienceSlug, p: PlanExperience): ExperienceMedia {
  const base = `/media/${p.folder}`;
  const version = plan.version;
  const status = p.hero.status as MediaStatus;
  const stills: Record<string, PosterSource> = {};
  for (const id of p.stills) {
    stills[id] = { desktop: `${base}/stills/${id}.webp`, mobile: `${base}/stills/${id}-mobile.webp` };
  }
  const scenes: Record<string, SceneMedia> = {};
  const planScenes = (p as { scenes?: Record<string, { frames: number; status: string; scrollHeight?: number }> }).scenes ?? {};
  for (const [id, sc] of Object.entries(planScenes)) {
    const poster = stills[id] ?? { desktop: `${base}/stills/${id}.webp`, mobile: `${base}/stills/${id}-mobile.webp` };
    const generated = sc.status === "generated";
    scenes[id] = {
      id: `${slug}:${id}`,
      status: sc.status as MediaStatus,
      version,
      poster,
      ...(generated
        ? {
            sequence: {
              desktop: { dir: `${base}/seq/${version}/${id}/desktop`, frameCount: sc.frames, width: plan.desktop.width, height: plan.desktop.height, extension: "webp" as const },
              mobile: { dir: `${base}/seq/${version}/${id}/mobile`, frameCount: sc.frames, width: plan.mobile.width, height: plan.mobile.height, extension: "webp" as const },
            },
          }
        : {}),
      focal: { x: 0.5, y: 0.5 },
      scrollHeight: sc.scrollHeight ?? 260,
    };
  }
  const poster: PosterSource = { desktop: `${base}/poster.webp`, mobile: `${base}/poster-mobile.webp` };
  return {
    folder: p.folder,
    poster,
    preview: {
      status,
      poster: { desktop: `${base}/poster.webp`, mobile: `${base}/poster-mobile.webp` },
      video: { desktop: { webm: `${base}/preview.webm` } },
      durationSeconds: 4,
    },
    hero: {
      id: `${slug}:${p.hero.id}`,
      status,
      version,
      poster: { desktop: `${base}/poster.webp`, mobile: `${base}/poster-mobile.webp` },
      sequence: {
        desktop: {
          dir: `${base}/seq/${version}/desktop`,
          frameCount: p.hero.frames,
          width: plan.desktop.width,
          height: plan.desktop.height,
          extension: "webp",
        },
        mobile: {
          dir: `${base}/seq/${version}/mobile`,
          frameCount: p.hero.frames,
          width: plan.mobile.width,
          height: plan.mobile.height,
          extension: "webp",
        },
      },
      focal: p.hero.focal,
      scrollHeight: p.hero.scrollHeight,
    },
    stills,
    scenes,
  };
}

export const mediaManifest: Record<ExperienceSlug, ExperienceMedia> = {
  "deep-sea-journey": buildExperienceMedia("deep-sea-journey", plan.experiences["deep-sea-journey"]),
  "personal-portfolio": buildExperienceMedia("personal-portfolio", plan.experiences["personal-portfolio"]),
  "luxury-product": buildExperienceMedia("luxury-product", plan.experiences["luxury-product"]),
  restaurant: buildExperienceMedia("restaurant", plan.experiences.restaurant),
  "real-estate": buildExperienceMedia("real-estate", plan.experiences["real-estate"]),
  automotive: buildExperienceMedia("automotive", plan.experiences.automotive),
  saas: buildExperienceMedia("saas", plan.experiences.saas),
  fitness: buildExperienceMedia("fitness", plan.experiences.fitness),
};

export const mediaPlanVersion = plan.version;
