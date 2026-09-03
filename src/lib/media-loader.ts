import { sequenceFrameUrl, type SequenceSource } from "@/content/media-manifest";

/**
 * Chargeur de séquences d'images.
 *  - décode via createImageBitmap (fallback Image)
 *  - priorité : première frame, dernière frame, puis frames proches de la position courante
 *  - concurrence limitée, cache libéré loin de la position courante en mode économe
 *  - compteur d'échecs pour basculer en mode static
 */
export type DecodedFrame = ImageBitmap | HTMLImageElement;

export interface FrameLoaderOptions {
  /** Charger une frame sur `stride` (2 en mode lite). */
  stride?: number;
  concurrency?: number;
  /** Nombre de frames gardées de chaque côté de la position (0 = tout garder). */
  keepRadius?: number;
  onFailure?: (failures: number) => void;
  onFrame?: (index: number) => void;
}

const supportsBitmap = typeof window !== "undefined" && "createImageBitmap" in window;

async function decode(url: string): Promise<DecodedFrame> {
  if (supportsBitmap) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      return await createImageBitmap(blob);
    } catch (e) {
      // fallback Image ci-dessous
      if (e instanceof Error && /HTTP/.test(e.message)) throw e;
    }
  }
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`decode failed: ${url}`));
    img.src = url;
  });
}

export class FrameLoader {
  readonly source: SequenceSource;
  private frames = new Map<number, DecodedFrame>();
  private pending = new Set<number>();
  private queue: number[] = [];
  private inflight = 0;
  private failures = 0;
  private destroyed = false;
  private position = 0;
  private opts: Required<Omit<FrameLoaderOptions, "onFailure" | "onFrame">> &
    Pick<FrameLoaderOptions, "onFailure" | "onFrame">;

  constructor(source: SequenceSource, opts: FrameLoaderOptions = {}) {
    this.source = source;
    this.opts = {
      stride: opts.stride ?? 1,
      concurrency: opts.concurrency ?? 6,
      keepRadius: opts.keepRadius ?? 0,
      onFailure: opts.onFailure,
      onFrame: opts.onFrame,
    };
  }

  get frameCount() {
    return this.source.frameCount;
  }

  /** Index effectivement chargé pour un index demandé (respect du stride). */
  normalize(index: number): number {
    const s = this.opts.stride;
    const max = this.source.frameCount - 1;
    if (index >= max) return max;
    return Math.round(index / s) * s;
  }

  has(index: number) {
    return this.frames.has(index);
  }

  get(index: number): DecodedFrame | undefined {
    return this.frames.get(index);
  }

  /** Frame la plus proche déjà décodée (évite tout écran noir). */
  nearest(index: number): DecodedFrame | undefined {
    if (this.frames.size === 0) return undefined;
    let best: number | null = null;
    let bestDist = Infinity;
    for (const k of this.frames.keys()) {
      const d = Math.abs(k - index);
      if (d < bestDist) {
        bestDist = d;
        best = k;
      }
    }
    return best === null ? undefined : this.frames.get(best);
  }

  /** Amorce : première et dernière frame, puis tout le reste par proximité. */
  prime(position: number) {
    this.position = position;
    const last = this.source.frameCount - 1;
    this.request(0, true);
    this.request(last, true);
    this.request(this.normalize(position), true);
    this.requestAll();
  }

  /** Recentre la priorité autour d'une position. */
  focus(position: number) {
    this.position = position;
    const idx = this.normalize(position);
    const radius = 6 * this.opts.stride;
    for (let d = 0; d <= radius; d += this.opts.stride) {
      this.request(idx + d, true);
      this.request(idx - d, true);
    }
    this.sortQueue();
    this.pump();
    this.evict();
  }

  private requestAll() {
    for (let i = 0; i < this.source.frameCount; i += this.opts.stride) this.request(i, false);
    this.request(this.source.frameCount - 1, false);
    this.sortQueue();
    this.pump();
  }

  private request(index: number, front: boolean) {
    if (index < 0 || index >= this.source.frameCount) return;
    if (this.frames.has(index) || this.pending.has(index)) return;
    this.pending.add(index);
    if (front) this.queue.unshift(index);
    else this.queue.push(index);
  }

  private sortQueue() {
    const pos = this.position;
    this.queue.sort((a, b) => Math.abs(a - pos) - Math.abs(b - pos));
  }

  private pump() {
    while (!this.destroyed && this.inflight < this.opts.concurrency && this.queue.length) {
      const index = this.queue.shift();
      if (index === undefined) break;
      this.inflight += 1;
      decode(sequenceFrameUrl(this.source, index))
        .then((frame) => {
          if (this.destroyed) {
            if ("close" in frame) frame.close();
            return;
          }
          this.frames.set(index, frame);
          this.opts.onFrame?.(index);
        })
        .catch(() => {
          this.failures += 1;
          this.opts.onFailure?.(this.failures);
        })
        .finally(() => {
          this.pending.delete(index);
          this.inflight -= 1;
          this.pump();
        });
    }
  }

  private evict() {
    const r = this.opts.keepRadius;
    if (!r) return;
    for (const [k, f] of this.frames) {
      if (k === 0 || k === this.source.frameCount - 1) continue;
      if (Math.abs(k - this.position) > r) {
        if ("close" in f) f.close();
        this.frames.delete(k);
      }
    }
  }

  destroy() {
    this.destroyed = true;
    this.queue = [];
    for (const f of this.frames.values()) if ("close" in f) f.close();
    this.frames.clear();
    this.pending.clear();
  }
}

/** Charge un poster (Image) avec promesse résolue même en cas d'échec (null). */
export function loadPoster(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/** Précharge un poster via <link rel="preload"> (poster de la scène suivante). */
export function preloadPoster(url: string) {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[rel="preload"][href="${url}"]`)) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
}
