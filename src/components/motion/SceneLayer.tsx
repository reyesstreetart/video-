"use client";

import type { SceneMedia } from "@/content/media-manifest";
import { SequenceCanvas } from "./SequenceCanvas";
import { ScrubPoster } from "./ScrubPoster";

interface SceneLayerProps {
  media: SceneMedia | undefined;
  /** Poster de repli si la scène n'est pas déclarée dans le plan. */
  fallbackPoster?: { desktop: string; mobile: string };
  range?: [number, number];
  scale?: [number, number];
  pan?: [number, number];
  className?: string;
}

/**
 * Couche média d'une scène secondaire : séquence d'images scrubée lorsque le clip a été généré,
 * sinon poster scrubé en CSS. Le remplacement du média ne demande aucun changement de composant.
 */
export function SceneLayer({ media, fallbackPoster, range = [0, 1], scale = [1.05, 1.18], pan = [0, 0], className }: SceneLayerProps) {
  if (media?.sequence) {
    return <SequenceCanvas media={media} range={range} className={className} />;
  }
  const poster = media?.poster ?? fallbackPoster;
  if (!poster) return null;
  return <ScrubPoster poster={poster} range={range} scale={scale} pan={pan} fade={0.06} className={className} />;
}
