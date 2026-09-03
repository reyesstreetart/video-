export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ease-in-out douce pour les overlays. */
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const formatNumberFr = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
