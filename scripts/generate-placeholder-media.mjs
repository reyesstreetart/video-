/**
 * Génère des médias de substitution (placeholders) pour les huit expériences, tant que
 * les films Higgsfield / Seedance ne sont pas produits.
 *
 * Sortie (public/media/<folder>/) :
 *   poster.webp, poster-mobile.webp          → carte d'accueil + poster du hero
 *   preview.webm                              → preview d'accueil (VP8, ~4 s, < 1,5 Mo)
 *   seq/<version>/desktop/NNN.webp            → séquence hero 16:9
 *   seq/<version>/mobile/NNN.webp             → séquence hero 9:16
 *   stills/<id>.webp, stills/<id>-mobile.webp → scènes secondaires
 *
 * Les compositions sont des SVG procéduraux (gradients, formes, particules) rendus via sharp.
 * Elles sont conçues pour être lisibles en avant et en arrière, sans texte ni logo.
 * Remplacer ces fichiers par les vrais exports (mêmes chemins) ne demande aucun changement de code.
 */
import { readFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const plan = JSON.parse(readFileSync(join(root, "src/content/media-plan.json"), "utf8"));
const outRoot = join(root, "public/media");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const skipVideo = process.argv.includes("--no-video");

/* ---------- utilitaires ---------- */
const mulberry = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const hex2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, t) => {
  const [r1, g1, b1] = hex2rgb(a);
  const [r2, g2, b2] = hex2rgb(b);
  return `rgb(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(lerp(b1, b2, t))})`;
};
const f = (n) => Number(n.toFixed(2));
const grain = (w, h, opacity = 0.05) =>
  `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${opacity} 0"/></filter><rect width="${w}" height="${h}" filter="url(#grain)"/>`;
const vignette = (w, h, strength = 0.7) =>
  `<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${strength}"/></radialGradient><rect width="${w}" height="${h}" fill="url(#vig)"/>`;
const svgDoc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

/* ---------- scènes ---------- */

/** 01 · Descente sous-marine (t: surface → fond) */
function deepSea(t, w, h) {
  const r = mulberry(11);
  const top = mix("#1a6fb0", "#000308", ease(clamp(t * 1.15)));
  const bottom = mix("#062a52", "#000000", ease(clamp(t * 1.1)));
  let s = `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
  <radialGradient id="beam" cx="50%" cy="0%" r="100%"><stop offset="0" stop-color="#8fe9ff" stop-opacity="0.55"/><stop offset="1" stop-color="#8fe9ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="ring" cx="50%" cy="50%" r="50%"><stop offset="0.6" stop-color="#3de8ff" stop-opacity="0"/><stop offset="0.85" stop-color="#3de8ff" stop-opacity="0.9"/><stop offset="1" stop-color="#3de8ff" stop-opacity="0"/></radialGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.012}"/></filter></defs>`;
  s += `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  // Surface (t < 0.12) : ligne d'eau descendante
  if (t < 0.14) {
    const y = h * (0.12 - t) * 1.3;
    s += `<rect width="${w}" height="${Math.max(0, y)}" fill="${mix("#dfe9f2", "#8fc2e8", t * 6)}"/>`;
    s += `<path d="M0 ${y} Q ${w * 0.25} ${y - 8} ${w * 0.5} ${y} T ${w} ${y} V0 H0Z" fill="#c9dcec" opacity="0.6"/>`;
  }
  // Rayons de lumière (disparaissent avec t)
  const rayOpacity = clamp(1 - t * 2.4) * 0.5;
  if (rayOpacity > 0) {
    for (let i = 0; i < 7; i++) {
      const x = w * (0.1 + i * 0.13) + Math.sin(t * 6 + i) * w * 0.02;
      s += `<polygon points="${x},0 ${x + w * 0.05},0 ${x + w * 0.2},${h} ${x - w * 0.05},${h}" fill="#bfefff" opacity="${f(rayOpacity * (0.4 + 0.6 * r()))}"/>`;
    }
  }
  // Bulles (montent quand on descend)
  const bubbleOpacity = clamp(1 - t * 1.6) * 0.6;
  for (let i = 0; i < 40; i++) {
    const bx = r() * w;
    const by = ((r() + 1 - t * 3) % 1 + 1) % 1 * h;
    const br = 2 + r() * 5;
    s += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(br)}" fill="none" stroke="#dff7ff" stroke-width="1" opacity="${f(bubbleOpacity * r())}"/>`;
  }
  // Baleine au loin (t 0.18–0.4)
  const whale = clamp((t - 0.18) / 0.06) * clamp((0.4 - t) / 0.06);
  if (whale > 0) {
    const wx = w * (0.72 + (t - 0.18) * 0.6);
    const wy = h * 0.35;
    s += `<g opacity="${f(whale * 0.35)}" fill="#041a33"><ellipse cx="${wx}" cy="${wy}" rx="${w * 0.12}" ry="${h * 0.045}"/><path d="M${wx + w * 0.11} ${wy} l${w * 0.05} -${h * 0.05} l0 ${h * 0.1}z"/></g>`;
  }
  // Méduses (t 0.38–0.62)
  const jelly = clamp((t - 0.38) / 0.08) * clamp((0.62 - t) / 0.08);
  if (jelly > 0) {
    for (let i = 0; i < 6; i++) {
      const jx = w * (0.1 + r() * 0.8);
      const jy = h * (0.15 + r() * 0.6) - t * h * 0.3;
      const jr = w * (0.02 + r() * 0.03);
      s += `<g opacity="${f(jelly * 0.6)}"><ellipse cx="${f(jx)}" cy="${f(jy)}" rx="${f(jr)}" ry="${f(jr * 0.7)}" fill="#7ddcff" opacity="0.5"/><path d="M${f(jx - jr * 0.6)} ${f(jy)} q${f(jr * 0.3)} ${f(jr * 2)} 0 ${f(jr * 3)} M${f(jx)} ${f(jy)} q${f(-jr * 0.3)} ${f(jr * 2)} 0 ${f(jr * 3.2)} M${f(jx + jr * 0.6)} ${f(jy)} q${f(jr * 0.3)} ${f(jr * 2)} 0 ${f(jr * 3)}" stroke="#a9ecff" stroke-width="1.2" fill="none" opacity="0.7"/></g>`;
    }
  }
  // Bioluminescence (t > 0.55)
  const bio = clamp((t - 0.55) / 0.15);
  if (bio > 0) {
    for (let i = 0; i < 90; i++) {
      const bx = r() * w;
      const by = (r() * h + t * h * 0.2) % h;
      s += `<circle cx="${f(bx)}" cy="${f(by)}" r="${f(1 + r() * 2.5)}" fill="${r() > 0.5 ? "#3de8ff" : "#8ff7c8"}" opacity="${f(bio * (0.3 + r() * 0.7))}"/>`;
    }
  }
  // Fond océanique (t > 0.82)
  const floor = clamp((t - 0.82) / 0.14);
  if (floor > 0) {
    const fy = h * (1.05 - floor * 0.32);
    s += `<path d="M0 ${h} L0 ${fy + 20} Q${w * 0.15} ${fy - 30} ${w * 0.3} ${fy + 10} T${w * 0.6} ${fy} T${w * 0.85} ${fy + 20} L${w} ${fy - 10} L${w} ${h}Z" fill="#070b10"/>`;
    for (let i = 0; i < 4; i++) {
      const vx = w * (0.2 + i * 0.2);
      s += `<ellipse cx="${vx}" cy="${fy + 5}" rx="${w * 0.03}" ry="${h * 0.01}" fill="#ff8a3d" opacity="${f(floor * 0.9)}"/><ellipse cx="${vx}" cy="${fy - h * 0.06}" rx="${w * 0.025}" ry="${h * 0.08}" fill="#ffb37a" opacity="${f(floor * 0.25)}" filter="url(#soft)"/>`;
    }
  }
  // Submersible EREBUS
  const sx = w * 0.5;
  const sy = h * (0.42 + Math.sin(t * 9) * 0.01);
  const sw = w * 0.16;
  const sh = h * 0.09;
  const lights = clamp((t - 0.36) / 0.1);
  if (lights > 0) {
    s += `<polygon points="${sx - sw * 0.25},${sy + sh * 0.4} ${sx - sw * 0.5},${h} ${sx + sw * 0.05},${h}" fill="url(#beam)" opacity="${f(lights * 0.8)}"/>`;
    s += `<polygon points="${sx + sw * 0.25},${sy + sh * 0.4} ${sx - sw * 0.05},${h} ${sx + sw * 0.5},${h}" fill="url(#beam)" opacity="${f(lights * 0.8)}"/>`;
  }
  s += `<ellipse cx="${sx}" cy="${sy}" rx="${sw}" ry="${sh}" fill="#05070c" stroke="#101722" stroke-width="2"/>`;
  s += `<ellipse cx="${sx}" cy="${sy - sh * 0.15}" rx="${sw * 0.9}" ry="${sh * 0.35}" fill="#0c1220" opacity="0.8"/>`;
  s += `<circle cx="${sx + sw * 0.45}" cy="${sy}" r="${sh * 0.55}" fill="url(#ring)"/><circle cx="${sx + sw * 0.45}" cy="${sy}" r="${sh * 0.32}" fill="#0a2a3a" stroke="#3de8ff" stroke-width="2"/>`;
  s += `<circle cx="${sx - sw * 0.25}" cy="${sy + sh * 0.4}" r="${sh * 0.16}" fill="${lights > 0 ? "#dffaff" : "#1b2a35"}"/><circle cx="${sx + sw * 0.25}" cy="${sy + sh * 0.4}" r="${sh * 0.16}" fill="${lights > 0 ? "#dffaff" : "#1b2a35"}"/>`;
  s += vignette(w, h, 0.6) + grain(w, h, 0.05);
  return s;
}

/** 02 · Portfolio : silhouette en orbite (t: 0 → 360°) */
function portfolio(t, w, h, variant = "orbit") {
  const r = mulberry(22);
  let s = `<defs><radialGradient id="bg" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#0b1330"/><stop offset="1" stop-color="#03050c"/></radialGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4c7dff" stop-opacity="0"/><stop offset="1" stop-color="#4c7dff" stop-opacity="0.9"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.01}"/></filter></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  if (variant === "builder" || variant === "closer") {
    const n = variant === "builder" ? 6 : 10;
    for (let i = 0; i < n; i++) {
      const sx = variant === "builder" ? w * (0.08 + (i % 3) * 0.3) : w * (0.05 + i * 0.1);
      const sy = variant === "builder" ? h * (0.15 + Math.floor(i / 3) * 0.3) : h * (0.2 + (i % 2) * 0.35);
      const sw = w * (variant === "builder" ? 0.24 : 0.08);
      const sh = h * (variant === "builder" ? 0.22 : 0.3);
      s += `<rect x="${f(sx)}" y="${f(sy)}" width="${f(sw)}" height="${f(sh)}" rx="4" fill="#0f1a3a" stroke="#4c7dff" stroke-opacity="0.5"/><rect x="${f(sx + 8)}" y="${f(sy + 8)}" width="${f(sw * (0.4 + r() * 0.5))}" height="6" fill="#4c7dff" opacity="0.6"/><rect x="${f(sx + 8)}" y="${f(sy + 22)}" width="${f(sw * (0.3 + r() * 0.4))}" height="4" fill="#98a2b7" opacity="0.4"/>`;
    }
  }
  const angle = t * Math.PI * 2;
  const cx = w * 0.5;
  const cy = h * 0.5;
  const width = w * (0.075 + 0.045 * Math.abs(Math.cos(angle)));
  const headR = w * 0.03;
  // Sol
  s += `<ellipse cx="${cx}" cy="${h * 0.86}" rx="${w * 0.22}" ry="${h * 0.04}" fill="#0a1230" stroke="#4c7dff" stroke-opacity="0.35"/>`;
  for (let i = 0; i < 24; i++) {
    const a = angle + (i / 24) * Math.PI * 2;
    const px = cx + Math.cos(a) * w * 0.22;
    const py = h * 0.86 + Math.sin(a) * h * 0.04;
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="${i === 0 ? 3 : 1.2}" fill="#c8a96b" opacity="${i === 0 ? 1 : 0.5}"/>`;
  }
  // Silhouette
  const rimSide = Math.sin(angle);
  s += `<g><path d="M${f(cx - width * 1.15)} ${f(cy - h * 0.1)} Q${f(cx - width * 1.2)} ${f(cy - h * 0.2)} ${f(cx - width * 0.5)} ${f(cy - h * 0.21)} L${f(cx + width * 0.5)} ${f(cy - h * 0.21)} Q${f(cx + width * 1.2)} ${f(cy - h * 0.2)} ${f(cx + width * 1.15)} ${f(cy - h * 0.1)} L${f(cx + width * 1.05)} ${f(cy + h * 0.36)} L${f(cx - width * 1.05)} ${f(cy + h * 0.36)}Z" fill="#070b18"/>`;
  s += `<rect x="${f(cx - width * 0.35)}" y="${f(cy - h * 0.25)}" width="${f(width * 0.7)}" height="${f(h * 0.06)}" fill="#070b18"/>`;
  s += `<circle cx="${cx}" cy="${f(cy - h * 0.24)}" r="${f(headR)}" fill="#070b18"/>`;
  s += `<rect x="${f(cx - width * 0.9)}" y="${f(cy - h * 0.05)}" width="${f(width * 1.8)}" height="${f(h * 0.06)}" rx="${f(h * 0.03)}" fill="#0a1024"/>`;
  // Rim light
  const rx = cx + rimSide * width * 0.8;
  s += `<rect x="${f(rx - 3)}" y="${f(cy - h * 0.16)}" width="6" height="${f(h * 0.5)}" rx="3" fill="#4c7dff" opacity="${f(0.5 + 0.4 * Math.abs(rimSide))}" filter="url(#soft)"/>`;
  s += `<circle cx="${f(cx + rimSide * headR * 0.8)}" cy="${f(cy - h * 0.24)}" r="${f(headR * 0.9)}" fill="none" stroke="#4c7dff" stroke-width="3" opacity="${f(0.35 + 0.4 * Math.abs(rimSide))}" filter="url(#soft)"/></g>`;
  s += `<ellipse cx="${f(cx - rimSide * w * 0.25)}" cy="${f(h * 0.3)}" rx="${w * 0.2}" ry="${h * 0.25}" fill="#123bc7" opacity="0.12" filter="url(#soft)"/>`;
  s += vignette(w, h, 0.75) + grain(w, h, 0.05);
  return s;
}

/** 03 · Montre : rotation studio (t: 0 → 360°) */
function watch(t, w, h, variant = "orbit") {
  const r = mulberry(33);
  let s = `<defs><radialGradient id="bg" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="#14120e"/><stop offset="1" stop-color="#000"/></radialGradient>
  <radialGradient id="gold" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#efd9a6"/><stop offset="0.6" stop-color="#c8a96b"/><stop offset="1" stop-color="#5c4a2a"/></radialGradient>
  <linearGradient id="ti" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3c3f47"/><stop offset="0.5" stop-color="#101114"/><stop offset="1" stop-color="#2b2e35"/></linearGradient>
  <radialGradient id="dial" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#1b1b20"/><stop offset="1" stop-color="#050506"/></radialGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.02"/><stop offset="1" stop-color="#fff" stop-opacity="0.12"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.006}"/></filter></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  // Poussière dorée
  for (let i = 0; i < 60; i++) {
    const px = r() * w;
    const py = (r() * h + t * h * 0.15) % h;
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(0.6 + r() * 1.6)}" fill="#e7cf9a" opacity="${f(0.15 + r() * 0.45)}"/>`;
  }
  const cx = w * 0.5;
  const cy = h * 0.5;
  const R = Math.min(w, h) * (variant === "macro" ? 0.7 : variant === "exploded" ? 0.28 : 0.3);
  const angle = t * Math.PI * 2;
  const cos = Math.cos(angle);
  const rx = Math.max(R * 0.07, R * Math.abs(cos));
  const flip = cos < 0;
  const off = variant === "exploded" ? [-R * 0.9, -R * 0.45, 0, R * 0.45, R * 0.9] : [0, 0, 0, 0, 0];
  if (variant === "macro") {
    // Cadran plein cadre, décalé
    const mx = cx - R * 0.35;
    const my = cy + R * 0.2;
    s += `<circle cx="${f(mx)}" cy="${f(my)}" r="${f(R)}" fill="url(#dial)"/>`;
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const l = i % 5 === 0 ? R * 0.1 : R * 0.04;
      s += `<line x1="${f(mx + Math.cos(a) * (R - l))}" y1="${f(my + Math.sin(a) * (R - l))}" x2="${f(mx + Math.cos(a) * R * 0.97)}" y2="${f(my + Math.sin(a) * R * 0.97)}" stroke="#c8a96b" stroke-width="${i % 5 === 0 ? 4 : 1.5}"/>`;
    }
    s += `<circle cx="${f(mx)}" cy="${f(my + R * 0.5)}" r="${f(R * 0.18)}" fill="none" stroke="url(#gold)" stroke-width="6"/><circle cx="${f(mx)}" cy="${f(my + R * 0.5)}" r="${f(R * 0.1)}" fill="none" stroke="#efd9a6" stroke-width="2"/>`;
    s += `<line x1="${f(mx)}" y1="${f(my)}" x2="${f(mx + R * 0.02)}" y2="${f(my - R * 0.7)}" stroke="#f4f0e8" stroke-width="7" stroke-linecap="round"/><line x1="${f(mx)}" y1="${f(my)}" x2="${f(mx + R * 0.55)}" y2="${f(my + R * 0.1)}" stroke="#f4f0e8" stroke-width="5" stroke-linecap="round"/>`;
    s += `<rect width="${w}" height="${h}" fill="url(#glass)" opacity="0.7"/>`;
  } else {
    const ry = R;
    const parts = [
      // fond de boîte
      `<ellipse cx="${f(cx + off[0] * 0)}" cy="${f(cy + off[0])}" rx="${f(rx * 1.02)}" ry="${f(ry * 1.02)}" fill="url(#ti)" stroke="#4a4d55" stroke-width="2"/>`,
      // mouvement
      `<ellipse cx="${f(cx)}" cy="${f(cy + off[1])}" rx="${f(rx * 0.86)}" ry="${f(ry * 0.86)}" fill="#0b0b0e" stroke="#3b3e46"/>`,
      // cadran + tourbillon + aiguilles
      (() => {
        let d = `<ellipse cx="${f(cx)}" cy="${f(cy + off[2])}" rx="${f(rx * 0.88)}" ry="${f(ry * 0.88)}" fill="url(#dial)"/>`;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          d += `<line x1="${f(cx + Math.cos(a) * rx * 0.72)}" y1="${f(cy + off[2] + Math.sin(a) * ry * 0.72)}" x2="${f(cx + Math.cos(a) * rx * 0.82)}" y2="${f(cy + off[2] + Math.sin(a) * ry * 0.82)}" stroke="#c8a96b" stroke-width="${i % 3 === 0 ? 4 : 2}"/>`;
        }
        d += `<ellipse cx="${f(cx)}" cy="${f(cy + off[2] + ry * 0.42)}" rx="${f(rx * 0.2)}" ry="${f(ry * 0.2)}" fill="none" stroke="url(#gold)" stroke-width="5"/><ellipse cx="${f(cx)}" cy="${f(cy + off[2] + ry * 0.42)}" rx="${f(rx * 0.12)}" ry="${f(ry * 0.12)}" fill="none" stroke="#efd9a6" stroke-width="1.5" transform="rotate(${f(t * 720)} ${f(cx)} ${f(cy + off[2] + ry * 0.42)})"/>`;
        d += `<line x1="${f(cx)}" y1="${f(cy + off[2])}" x2="${f(cx + rx * 0.05)}" y2="${f(cy + off[2] - ry * 0.55)}" stroke="#f4f0e8" stroke-width="4" stroke-linecap="round"/><line x1="${f(cx)}" y1="${f(cy + off[2])}" x2="${f(cx + rx * 0.5)}" y2="${f(cy + off[2] + ry * 0.12)}" stroke="#f4f0e8" stroke-width="3" stroke-linecap="round"/>`;
        return d;
      })(),
      // lunette
      `<ellipse cx="${f(cx)}" cy="${f(cy + off[3])}" rx="${f(rx)}" ry="${f(ry)}" fill="none" stroke="url(#ti)" stroke-width="${f(R * 0.09)}"/><ellipse cx="${f(cx)}" cy="${f(cy + off[3])}" rx="${f(rx * 0.93)}" ry="${f(ry * 0.93)}" fill="none" stroke="#c8a96b" stroke-width="1.5" opacity="0.8"/>`,
      // verre
      `<ellipse cx="${f(cx)}" cy="${f(cy + off[4])}" rx="${f(rx * 0.9)}" ry="${f(ry * 0.9)}" fill="url(#glass)" stroke="#fff" stroke-opacity="0.3"/>`,
    ];
    // Couronne + cornes
    const side = flip ? -1 : 1;
    s += `<rect x="${f(cx + side * rx - (side > 0 ? 0 : R * 0.08))}" y="${f(cy - R * 0.05)}" width="${f(R * 0.08)}" height="${f(R * 0.1)}" rx="3" fill="url(#ti)"/>`;
    s += `<rect x="${f(cx - rx * 0.55)}" y="${f(cy - ry * 1.02 - R * 0.45)}" width="${f(rx * 1.1)}" height="${f(R * 0.5)}" rx="${f(R * 0.1)}" fill="#0a0a0c" stroke="#26282e"/><rect x="${f(cx - rx * 0.55)}" y="${f(cy + ry * 0.95)}" width="${f(rx * 1.1)}" height="${f(R * 0.5)}" rx="${f(R * 0.1)}" fill="#0a0a0c" stroke="#26282e"/>`;
    if (flip) {
      // Face arrière : fond visible en premier plan
      s += parts[4] + parts[3] + parts[2] + parts[1] + parts[0];
    } else {
      s += parts.join("");
    }
    // Rim light
    s += `<ellipse cx="${f(cx - rx * 0.1)}" cy="${f(cy - ry * 0.1)}" rx="${f(rx * 1.02)}" ry="${f(ry * 1.02)}" fill="none" stroke="#efd9a6" stroke-width="2" opacity="${f(0.25 + 0.4 * Math.abs(Math.sin(angle)))}" filter="url(#soft)"/>`;
  }
  s += vignette(w, h, 0.8) + grain(w, h, 0.045);
  return s;
}

/** 04 · Restaurant : feu (t: intensité), room, craft */
function fire(t, w, h, variant = "fire") {
  const r = mulberry(44);
  let s = `<defs><radialGradient id="bg" cx="50%" cy="85%" r="80%"><stop offset="0" stop-color="${variant === "room" ? "#3a2210" : "#3b1a06"}"/><stop offset="0.5" stop-color="#150a04"/><stop offset="1" stop-color="#050302"/></radialGradient>
  <radialGradient id="ember" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd27a"/><stop offset="0.4" stop-color="#ff7a2f"/><stop offset="1" stop-color="#ff7a2f" stop-opacity="0"/></radialGradient>
  <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb347"/><stop offset="0.5" stop-color="#ff6a1f"/><stop offset="1" stop-color="#ff3d00" stop-opacity="0"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.012}"/></filter><filter id="softer"><feGaussianBlur stdDeviation="${w * 0.03}"/></filter></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  if (variant === "room") {
    // Salle : tables, bougies, bar
    s += `<rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="#1d1109"/>`;
    s += `<rect x="${w * 0.6}" y="${h * 0.3}" width="${w * 0.4}" height="${h * 0.32}" fill="#2a1a0c"/><rect x="${w * 0.62}" y="${h * 0.33}" width="${w * 0.36}" height="${h * 0.04}" fill="#c8a96b" opacity="0.5"/>`;
    for (let i = 0; i < 14; i++) {
      const bx = w * (0.62 + (i % 7) * 0.05);
      const by = h * (0.4 + Math.floor(i / 7) * 0.09);
      s += `<rect x="${f(bx)}" y="${f(by)}" width="${w * 0.012}" height="${h * 0.06}" fill="#e8c27a" opacity="0.6"/>`;
    }
    for (let i = 0; i < 4; i++) {
      const tx = w * (0.08 + i * 0.14);
      const ty = h * (0.66 + (i % 2) * 0.1);
      s += `<ellipse cx="${f(tx)}" cy="${f(ty)}" rx="${w * 0.07}" ry="${h * 0.03}" fill="#3b2412"/><ellipse cx="${f(tx)}" cy="${f(ty - h * 0.04)}" rx="${w * 0.02}" ry="${h * 0.04}" fill="url(#ember)" filter="url(#soft)"/>`;
      s += `<rect x="${f(tx - w * 0.09)}" y="${f(ty - h * 0.1)}" width="${w * 0.035}" height="${h * 0.14}" rx="6" fill="#4a2c16"/>`;
    }
    for (let i = 0; i < 6; i++) {
      s += `<circle cx="${f(w * (0.1 + i * 0.16))}" cy="${f(h * 0.12)}" r="${w * 0.012}" fill="#ffd27a" opacity="0.7" filter="url(#soft)"/>`;
    }
  } else if (variant === "craft") {
    // Ardoise, assiette, mains stylisées, vapeur
    s += `<rect x="0" y="${h * 0.55}" width="${w}" height="${h * 0.45}" fill="#0f0f10"/>`;
    s += `<ellipse cx="${w * 0.5}" cy="${h * 0.66}" rx="${w * 0.18}" ry="${h * 0.12}" fill="#efe6d8"/><ellipse cx="${w * 0.5}" cy="${h * 0.66}" rx="${w * 0.15}" ry="${h * 0.095}" fill="#f7f1e8"/>`;
    s += `<ellipse cx="${w * 0.5}" cy="${h * 0.65}" rx="${w * 0.06}" ry="${h * 0.04}" fill="#6b2f1a"/><ellipse cx="${w * 0.46}" cy="${h * 0.63}" rx="${w * 0.02}" ry="${h * 0.012}" fill="#8fbf5a"/>`;
    s += `<path d="M${w * 0.2} ${h * 0.75} q${w * 0.1} -${h * 0.2} ${w * 0.16} -${h * 0.02}" stroke="#4a2c16" stroke-width="${w * 0.03}" stroke-linecap="round" fill="none"/><path d="M${w * 0.8} ${h * 0.78} q-${w * 0.1} -${h * 0.2} -${w * 0.16} -${h * 0.05}" stroke="#4a2c16" stroke-width="${w * 0.03}" stroke-linecap="round" fill="none"/>`;
    for (let i = 0; i < 5; i++) {
      s += `<ellipse cx="${f(w * (0.44 + i * 0.03))}" cy="${f(h * (0.5 - i * 0.05))}" rx="${w * 0.03}" ry="${h * 0.06}" fill="#fff" opacity="${f(0.12 - i * 0.02)}" filter="url(#softer)"/>`;
    }
  } else {
    // Feu : grille, pièce de viande, flammes, braises
    const heat = 0.5 + t * 0.5;
    s += `<ellipse cx="${w * 0.5}" cy="${h * 0.95}" rx="${w * 0.45}" ry="${h * 0.3}" fill="#ff6a1f" opacity="${f(0.25 * heat)}" filter="url(#softer)"/>`;
    for (let i = 0; i < 9; i++) {
      const fx = w * (0.15 + i * 0.09);
      const fh = h * (0.18 + 0.22 * heat * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 2 + i * 1.7)));
      s += `<path d="M${f(fx - w * 0.04)} ${h} Q${f(fx - w * 0.01)} ${f(h - fh * 0.6)} ${f(fx)} ${f(h - fh)} Q${f(fx + w * 0.01)} ${f(h - fh * 0.6)} ${f(fx + w * 0.04)} ${h}Z" fill="url(#flame)" opacity="0.85" filter="url(#soft)"/>`;
    }
    for (let i = 0; i < 7; i++) {
      s += `<rect x="0" y="${f(h * (0.58 + i * 0.05))}" width="${w}" height="3" fill="#1a1a1a"/>`;
    }
    s += `<rect x="${w * 0.32}" y="${h * 0.5}" width="${w * 0.36}" height="${h * 0.17}" rx="${h * 0.06}" fill="#4a1a10"/><rect x="${w * 0.34}" y="${h * 0.52}" width="${w * 0.32}" height="${h * 0.12}" rx="${h * 0.05}" fill="#7a2c1a"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${f(w * (0.36 + i * 0.065))}" y="${h * 0.53}" width="${w * 0.02}" height="${h * 0.1}" fill="#2a0e08" opacity="0.7"/>`;
    for (let i = 0; i < 70; i++) {
      const ex = r() * w;
      const ey = ((r() - t * 1.2) % 1 + 1) % 1 * h;
      s += `<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(1 + r() * 3)}" fill="url(#ember)" opacity="${f(0.3 + r() * 0.7 * heat)}"/>`;
    }
  }
  s += vignette(w, h, 0.7) + grain(w, h, 0.06);
  return s;
}

/** 05 · Immobilier : approche → intérieur → terrasse (t) */
function tower(t, w, h) {
  const r = mulberry(55);
  const night = ease(clamp(t * 1.4));
  const skyTop = mix("#2b1b4a", "#03050c", night);
  const skyBot = mix("#e58a4a", "#0a1230", night);
  let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBot}"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f2a4a"/><stop offset="0.5" stop-color="#0b1020"/><stop offset="1" stop-color="#2a3560"/></linearGradient>
  <linearGradient id="marble" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e4da"/><stop offset="1" stop-color="#cfc8ba"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.01}"/></filter></defs><rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  // Skyline
  for (let i = 0; i < 26; i++) {
    const bx = (i / 26) * w;
    const bh = h * (0.15 + r() * 0.3);
    s += `<rect x="${f(bx)}" y="${f(h - bh)}" width="${f(w / 26 - 3)}" height="${f(bh)}" fill="#070a16"/>`;
    const lit = Math.floor(r() * 10 * night);
    for (let k = 0; k < lit; k++) s += `<rect x="${f(bx + 4 + r() * (w / 26 - 12))}" y="${f(h - bh + 6 + r() * (bh - 12))}" width="3" height="4" fill="#ffd27a" opacity="${f(0.5 + r() * 0.5)}"/>`;
  }
  const approach = clamp(t / 0.45);
  const interior = clamp((t - 0.45) / 0.15);
  const terrace = clamp((t - 0.78) / 0.18);
  // Tour (approche : elle grandit)
  const th = h * lerp(0.55, 1.5, ease(approach));
  const tw = w * lerp(0.1, 0.42, ease(approach));
  const tx = w * 0.5 - tw / 2;
  s += `<rect x="${f(tx)}" y="${f(h - th)}" width="${f(tw)}" height="${f(th)}" fill="url(#glass)"/>`;
  const floors = 40;
  for (let i = 0; i < floors; i++) {
    const y = h - th + (i / floors) * th;
    s += `<rect x="${f(tx)}" y="${f(y)}" width="${f(tw)}" height="1" fill="#3a4a7a" opacity="0.5"/>`;
    if (r() < 0.5 * night + 0.05) s += `<rect x="${f(tx + r() * tw * 0.8)}" y="${f(y + 3)}" width="${f(tw * 0.15)}" height="${f(Math.max(2, th / floors - 6))}" fill="#ffd27a" opacity="${f(0.3 + r() * 0.5)}"/>`;
  }
  s += `<rect x="${f(tx)}" y="${f(h - th - 6)}" width="${f(tw)}" height="6" fill="#c8a96b" opacity="0.9"/>`;
  // Intérieur (fondu)
  if (interior > 0) {
    const ino = ease(interior) * (1 - ease(terrace));
    s += `<g opacity="${f(ino)}"><rect width="${w}" height="${h}" fill="#0a0a0e"/>`;
    s += `<rect x="0" y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="url(#marble)"/>`;
    // Baie vitrée sur la ville
    s += `<rect x="${w * 0.08}" y="${h * 0.12}" width="${w * 0.84}" height="${h * 0.58}" fill="url(#sky)"/>`;
    for (let i = 0; i < 30; i++) {
      const bx = w * 0.08 + (i / 30) * w * 0.84;
      const bh = h * (0.08 + r() * 0.22);
      s += `<rect x="${f(bx)}" y="${f(h * 0.7 - bh)}" width="${f((w * 0.84) / 30 - 2)}" height="${f(bh)}" fill="#070a16"/>`;
      for (let k = 0; k < 4; k++) s += `<rect x="${f(bx + r() * 20)}" y="${f(h * 0.7 - bh + r() * bh)}" width="2" height="3" fill="#ffd27a" opacity="0.7"/>`;
    }
    for (let i = 0; i < 5; i++) s += `<rect x="${f(w * (0.08 + i * 0.21))}" y="${h * 0.12}" width="4" height="${h * 0.58}" fill="#1a1a1e"/>`;
    // Mobilier
    s += `<rect x="${w * 0.15}" y="${h * 0.6}" width="${w * 0.3}" height="${h * 0.14}" rx="8" fill="#2a2620"/><rect x="${w * 0.55}" y="${h * 0.64}" width="${w * 0.2}" height="${h * 0.06}" fill="#3a3630"/>`;
    s += `<circle cx="${w * 0.5}" cy="${h * 0.2}" r="${w * 0.03}" fill="#ffd27a" opacity="0.5" filter="url(#soft)"/></g>`;
  }
  // Terrasse
  if (terrace > 0) {
    const to = ease(terrace);
    s += `<g opacity="${f(to)}"><rect width="${w}" height="${h}" fill="url(#sky)"/>`;
    for (let i = 0; i < 30; i++) {
      const bx = (i / 30) * w;
      const bh = h * (0.1 + r() * 0.3);
      s += `<rect x="${f(bx)}" y="${f(h * 0.6 - bh)}" width="${f(w / 30 - 2)}" height="${f(bh)}" fill="#070a16"/>`;
      for (let k = 0; k < 6; k++) s += `<rect x="${f(bx + r() * 20)}" y="${f(h * 0.6 - bh + r() * bh)}" width="2" height="3" fill="#ffd27a" opacity="0.8"/>`;
    }
    s += `<rect x="0" y="${h * 0.6}" width="${w}" height="${h * 0.4}" fill="#101010"/>`;
    s += `<rect x="${w * 0.1}" y="${h * 0.66}" width="${w * 0.8}" height="${h * 0.26}" fill="#0f3550"/><rect x="${w * 0.1}" y="${h * 0.66}" width="${w * 0.8}" height="${h * 0.26}" fill="url(#sky)" opacity="0.5"/>`;
    for (let i = 0; i < 12; i++) s += `<rect x="${f(w * (0.12 + i * 0.065))}" y="${f(h * (0.7 + r() * 0.15))}" width="${w * 0.02}" height="2" fill="#ffd27a" opacity="0.6"/>`;
    for (let i = 0; i < 40; i++) s += `<circle cx="${f(r() * w)}" cy="${f(r() * h * 0.4)}" r="1" fill="#fff" opacity="${f(r())}"/>`;
    s += `</g>`;
  }
  s += vignette(w, h, 0.65) + grain(w, h, 0.05);
  return s;
}

/** 06 · Automobile : désert blanc → plaines → canyon → nuit (t) */
function car(t, w, h) {
  const r = mulberry(66);
  const stops = [
    { at: 0, sky: "#e8ecef", ground: "#f2efe6", far: "#c9cfd6" },
    { at: 0.3, sky: "#dfe3e6", ground: "#d9c9a6", far: "#a89a7c" },
    { at: 0.55, sky: "#b44b2c", ground: "#7a2f1c", far: "#5a2216" },
    { at: 0.8, sky: "#050a1c", ground: "#0b0f1e", far: "#141a30" },
    { at: 1, sky: "#02050f", ground: "#070a16", far: "#0d1226" },
  ];
  let i = 0;
  while (i < stops.length - 2 && t >= stops[i + 1].at) i++;
  const a = stops[i];
  const b = stops[i + 1];
  const k = ease(clamp((t - a.at) / (b.at - a.at)));
  const sky = mix(a.sky, b.sky, k);
  const ground = mix(a.ground, b.ground, k);
  const far = mix(a.far, b.far, k);
  let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="${ground}"/></linearGradient>
  <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1b1f"/><stop offset="0.5" stop-color="#050506"/><stop offset="1" stop-color="#0d0e11"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.008}"/></filter><filter id="softer"><feGaussianBlur stdDeviation="${w * 0.03}"/></filter></defs><rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  const horizon = h * 0.58;
  // Reliefs
  const canyon = clamp((t - 0.45) / 0.12) * clamp((0.95 - t) / 0.12);
  s += `<path d="M0 ${horizon} L${w * 0.15} ${horizon - h * 0.08} L${w * 0.3} ${horizon - h * 0.03} L${w * 0.5} ${horizon - h * 0.12} L${w * 0.7} ${horizon - h * 0.05} L${w * 0.85} ${horizon - h * 0.1} L${w} ${horizon - h * 0.02} L${w} ${horizon}Z" fill="${far}"/>`;
  if (canyon > 0) {
    s += `<path d="M0 0 L${w * 0.28} 0 L${w * 0.12} ${h}L0 ${h}Z" fill="#4a1b10" opacity="${f(canyon)}"/><path d="M${w} 0 L${w * 0.72} 0 L${w * 0.88} ${h}L${w} ${h}Z" fill="#3e1810" opacity="${f(canyon)}"/>`;
  }
  s += `<rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="${ground}"/>`;
  // Étoiles la nuit
  const night = clamp((t - 0.78) / 0.12);
  if (night > 0) for (let j = 0; j < 80; j++) s += `<circle cx="${f(r() * w)}" cy="${f(r() * horizon * 0.9)}" r="${f(0.6 + r())}" fill="#fff" opacity="${f(night * r())}"/>`;
  // Lignes de vitesse
  const speed = clamp((t - 0.2) / 0.3) * clamp((1.05 - t) / 0.25 + 0.4, 0, 1);
  for (let j = 0; j < 22; j++) {
    const y = horizon + ((j / 22) * (h - horizon)) ** 1 * 1;
    const len = w * (0.05 + r() * 0.3) * speed;
    const x = r() * w;
    s += `<rect x="${f(x)}" y="${f(y)}" width="${f(len)}" height="${j % 4 === 0 ? 2 : 1}" fill="${night > 0.5 ? "#37e6ff" : "#ffffff"}" opacity="${f(0.15 + 0.4 * speed)}"/>`;
  }
  // Poussière (reveal)
  const dust = clamp(1 - t / 0.18);
  if (dust > 0) for (let j = 0; j < 12; j++) s += `<ellipse cx="${f(w * (0.2 + r() * 0.6))}" cy="${f(horizon + h * 0.1 + r() * h * 0.1)}" rx="${f(w * 0.1)}" ry="${f(h * 0.05)}" fill="#fff" opacity="${f(dust * 0.35 * r())}" filter="url(#softer)"/>`;
  // Voiture
  const cx = w * 0.5;
  const cy = h * 0.72;
  const cw = Math.min(w * 0.42, h * 0.32);
  const ch = cw * 0.31;
  s += `<ellipse cx="${cx}" cy="${cy + ch * 0.55}" rx="${cw * 0.55}" ry="${ch * 0.3}" fill="#000" opacity="0.45" filter="url(#soft)"/>`;
  s += `<path d="M${cx - cw / 2} ${cy + ch * 0.3} Q${cx - cw * 0.48} ${cy - ch * 0.1} ${cx - cw * 0.3} ${cy - ch * 0.2} L${cx - cw * 0.15} ${cy - ch * 0.75} Q${cx} ${cy - ch * 0.95} ${cx + cw * 0.18} ${cy - ch * 0.7} L${cx + cw * 0.35} ${cy - ch * 0.25} Q${cx + cw * 0.5} ${cy - ch * 0.05} ${cx + cw / 2} ${cy + ch * 0.3} L${cx + cw / 2} ${cy + ch * 0.45} L${cx - cw / 2} ${cy + ch * 0.45}Z" fill="url(#body)"/>`;
  s += `<circle cx="${f(cx - cw * 0.32)}" cy="${f(cy + ch * 0.4)}" r="${f(ch * 0.42)}" fill="#050506" stroke="#26282e" stroke-width="3"/><circle cx="${f(cx + cw * 0.32)}" cy="${f(cy + ch * 0.4)}" r="${f(ch * 0.42)}" fill="#050506" stroke="#26282e" stroke-width="3"/>`;
  const light = clamp((t - 0.04) / 0.12);
  s += `<rect x="${f(cx - cw * 0.46)}" y="${f(cy + ch * 0.02)}" width="${f(cw * 0.92)}" height="3" fill="#37e6ff" opacity="${f(light)}" filter="url(#soft)"/><rect x="${f(cx - cw * 0.46)}" y="${f(cy + ch * 0.02)}" width="${f(cw * 0.92)}" height="2" fill="#dffbff" opacity="${f(light)}"/>`;
  if (night > 0) s += `<rect x="${f(cx - cw * 0.7)}" y="${f(cy + ch * 0.1)}" width="${f(cw * 1.4)}" height="${f(ch * 0.4)}" fill="#37e6ff" opacity="${f(night * 0.35)}" filter="url(#softer)"/>`;
  s += `<path d="M${cx - cw * 0.25} ${cy - ch * 0.25} L${cx - cw * 0.12} ${cy - ch * 0.7} L${cx + cw * 0.15} ${cy - ch * 0.66} L${cx + cw * 0.3} ${cy - ch * 0.25}Z" fill="#0f1116" opacity="0.9"/>`;
  s += vignette(w, h, 0.55) + grain(w, h, 0.05);
  return s;
}

/** 07 · SaaS : particules s'assemblant en dashboard (t) */
function particles(t, w, h, variant = "particles") {
  const r = mulberry(77);
  const bright = variant === "calm";
  let s = `<defs><radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="${bright ? "#ffffff" : "#120f22"}"/><stop offset="1" stop-color="${bright ? "#e9e6f2" : "#05040a"}"/></radialGradient><filter id="soft"><feGaussianBlur stdDeviation="${w * 0.006}"/></filter></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  const panels = [
    [0.2, 0.2, 0.18, 0.14],
    [0.41, 0.2, 0.18, 0.14],
    [0.62, 0.2, 0.18, 0.14],
    [0.2, 0.38, 0.39, 0.4],
    [0.62, 0.38, 0.18, 0.4],
  ];
  const k = ease(clamp(t / 0.85));
  if (variant === "signal") {
    // Graphiques holographiques + anomalie rouge
    for (let i = 0; i < 6; i++) {
      const y = h * (0.2 + i * 0.12);
      let d = `M0 ${y}`;
      for (let x = 0; x <= w; x += w / 24) d += ` L${f(x)} ${f(y - Math.sin(x / w * 12 + i) * h * 0.03 - r() * h * 0.02)}`;
      s += `<path d="${d}" stroke="#8b5cf6" stroke-width="1.5" fill="none" opacity="${f(0.3 + i * 0.1)}"/>`;
    }
    s += `<circle cx="${w * 0.68}" cy="${h * 0.42}" r="${w * 0.02}" fill="#e23b3b" filter="url(#soft)"/><circle cx="${w * 0.68}" cy="${h * 0.42}" r="${w * 0.045}" fill="none" stroke="#e23b3b" stroke-width="2" opacity="0.6"/>`;
  } else if (bright) {
    // Bureau lumineux + ordinateur avec dashboard
    s += `<rect x="0" y="${h * 0.68}" width="${w}" height="${h * 0.32}" fill="#d9d5cc"/>`;
    s += `<rect x="${w * 0.28}" y="${h * 0.3}" width="${w * 0.44}" height="${h * 0.38}" rx="8" fill="#1a1a22"/><rect x="${w * 0.295}" y="${h * 0.315}" width="${w * 0.41}" height="${h * 0.35}" fill="#f6f5fa"/>`;
    for (const [px, py, pw, ph] of panels) {
      s += `<rect x="${f(w * 0.295 + (px - 0.2) * w * 0.68)}" y="${f(h * 0.315 + (py - 0.2) * h * 0.62)}" width="${f(pw * w * 0.68)}" height="${f(ph * h * 0.62)}" rx="4" fill="#fff" stroke="#e2dff0"/>`;
    }
    s += `<polyline points="${Array.from({ length: 12 }, (_, i) => `${f(w * 0.31 + i * w * 0.02)},${f(h * 0.6 - i * h * 0.012 - r() * h * 0.02)}`).join(" ")}" fill="none" stroke="#8b5cf6" stroke-width="2"/>`;
    s += `<rect x="${w * 0.26}" y="${h * 0.68}" width="${w * 0.48}" height="${h * 0.02}" rx="4" fill="#0f0f14"/>`;
  } else {
    for (let i = 0; i < 700; i++) {
      const p = panels[i % panels.length];
      const sx = r() * w;
      const sy = r() * h;
      const tx = w * (p[0] + r() * p[2]);
      const ty = h * (p[1] + r() * p[3]);
      const x = lerp(sx, tx, k);
      const y = lerp(sy, ty, k);
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.8 + r() * 1.4)}" fill="${r() > 0.8 ? "#c4b5fd" : "#8b5cf6"}" opacity="${f(0.35 + r() * 0.6)}"/>`;
    }
    for (const [px, py, pw, ph] of panels) {
      s += `<rect x="${f(w * px)}" y="${f(h * py)}" width="${f(w * pw)}" height="${f(h * ph)}" rx="6" fill="none" stroke="#8b5cf6" stroke-opacity="${f(k * 0.8)}"/>`;
    }
    const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 6);
    s += `<polyline points="${Array.from({ length: 12 }, (_, i) => `${f(w * (0.23 + i * 0.03))},${f(h * (0.72 - i * 0.02 * k - Math.sin(i) * 0.02))}`).join(" ")}" fill="none" stroke="#c4b5fd" stroke-width="2" opacity="${f(k)}"/>`;
    s += `<circle cx="${f(w * 0.56)}" cy="${f(h * (0.72 - 0.22 * k))}" r="${f(4 + pulse * 6)}" fill="#c4b5fd" opacity="${f(k * (0.4 + pulse * 0.5))}" filter="url(#soft)"/>`;
  }
  s += vignette(w, h, bright ? 0.25 : 0.7) + grain(w, h, 0.04);
  return s;
}

/** 08 · Fitness : nuage de magnésie (t), barre, piste à l'aube */
function chalk(t, w, h, variant = "chalk") {
  const r = mulberry(88);
  let s = `<defs><radialGradient id="bg" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="${variant === "grind" ? "#f0a35a" : "#1a1a1c"}"/><stop offset="1" stop-color="${variant === "grind" ? "#2a1a24" : "#050505"}"/></radialGradient>
  <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="${w * 0.012}"/></filter><filter id="softer"><feGaussianBlur stdDeviation="${w * 0.035}"/></filter></defs><rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  if (variant === "iron") {
    s += `<rect x="0" y="${h * 0.47}" width="${w}" height="${h * 0.06}" fill="#5a5c60"/><rect x="0" y="${h * 0.49}" width="${w}" height="${h * 0.02}" fill="#8b8d92"/>`;
    for (let i = 0; i < 60; i++) s += `<rect x="${f(w * 0.25 + i * w * 0.0085)}" y="${h * 0.47}" width="2" height="${h * 0.06}" fill="#2a2b2e" opacity="0.7"/>`;
    for (let i = 0; i < 3; i++) s += `<rect x="${f(w * (0.02 + i * 0.05))}" y="${h * 0.3}" width="${w * 0.04}" height="${h * 0.4}" rx="6" fill="#1b1b1e" stroke="#3a3a3f"/><rect x="${f(w * (0.94 - i * 0.05))}" y="${h * 0.3}" width="${w * 0.04}" height="${h * 0.4}" rx="6" fill="#1b1b1e" stroke="#3a3a3f"/>`;
    s += `<path d="M${w * 0.55} ${h * 0.75} q${w * 0.05} -${h * 0.35} ${w * 0.12} -${h * 0.2}" stroke="#3a2c24" stroke-width="${w * 0.04}" stroke-linecap="round" fill="none"/>`;
    s += `<rect x="${w * 0.2}" y="0" width="${w * 0.6}" height="${h}" fill="url(#shaft)" opacity="0.4"/>`;
  } else if (variant === "grind") {
    s += `<rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="#3a1d24"/>`;
    for (let i = 0; i < 7; i++) s += `<path d="M${f(w * (0.1 + i * 0.13))} ${h} L${f(w * (0.42 + i * 0.03))} ${h * 0.62}" stroke="#f4f0e8" stroke-width="2" opacity="0.5"/>`;
    s += `<circle cx="${w * 0.5}" cy="${h * 0.5}" r="${w * 0.12}" fill="#ffd27a" opacity="0.45" filter="url(#softer)"/>`;
    s += `<g fill="#100a0e"><ellipse cx="${w * 0.42}" cy="${h * 0.62}" rx="${w * 0.03}" ry="${h * 0.16}" transform="rotate(-20 ${w * 0.42} ${h * 0.62})"/><ellipse cx="${w * 0.46}" cy="${h * 0.78}" rx="${w * 0.02}" ry="${h * 0.12}" transform="rotate(35 ${w * 0.46} ${h * 0.78})"/><ellipse cx="${w * 0.38}" cy="${h * 0.8}" rx="${w * 0.02}" ry="${h * 0.12}" transform="rotate(-40 ${w * 0.38} ${h * 0.8})"/><circle cx="${w * 0.41}" cy="${h * 0.42}" r="${w * 0.028}"/></g>`;
  } else {
    // Faisceau vertical
    s += `<polygon points="${w * 0.42},0 ${w * 0.58},0 ${w * 0.75},${h} ${w * 0.25},${h}" fill="url(#shaft)"/>`;
    // Mains
    const gap = w * 0.02 * (1 - clamp(t * 5));
    s += `<g fill="#0c0c0d"><ellipse cx="${f(w * 0.44 - gap)}" cy="${h * 0.55}" rx="${w * 0.05}" ry="${h * 0.12}" transform="rotate(15 ${f(w * 0.44 - gap)} ${h * 0.55})"/><ellipse cx="${f(w * 0.56 + gap)}" cy="${h * 0.55}" rx="${w * 0.05}" ry="${h * 0.12}" transform="rotate(-15 ${f(w * 0.56 + gap)} ${h * 0.55})"/><rect x="${w * 0.36}" y="${h * 0.62}" width="${w * 0.06}" height="${h * 0.4}" fill="#0c0c0d"/><rect x="${w * 0.58}" y="${h * 0.62}" width="${w * 0.06}" height="${h * 0.4}" fill="#0c0c0d"/></g>`;
    // Nuage de magnésie
    const cloud = ease(clamp(t));
    for (let i = 0; i < 70; i++) {
      const a = r() * Math.PI * 2;
      const d = r() * cloud;
      const cx = w * 0.5 + Math.cos(a) * w * 0.3 * d;
      const cy = h * 0.52 + Math.sin(a) * h * 0.35 * d - cloud * h * 0.1;
      s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(w * (0.01 + r() * 0.05) * (0.3 + cloud))}" fill="#e8e4dc" opacity="${f((0.12 + r() * 0.25) * (1 - cloud * 0.5))}" filter="url(#soft)"/>`;
    }
    s += `<circle cx="${w * 0.5}" cy="${h * 0.5}" r="${f(w * 0.12 * cloud + 4)}" fill="#fff" opacity="${f(0.35 * (1 - cloud * 0.6))}" filter="url(#softer)"/>`;
    s += `<rect x="0" y="${h * 0.985}" width="${w}" height="${h * 0.015}" fill="#e23b3b" opacity="0.8"/>`;
  }
  s += vignette(w, h, 0.7) + grain(w, h, 0.07);
  return s;
}

/* ---------- plan de rendu ---------- */
const scenes = {
  "deep-sea-journey": { seq: (t, w, h) => deepSea(t, w, h), posterAt: 0.16, stills: { surface: (w, h) => deepSea(0.02, w, h), sunlit: (w, h) => deepSea(0.25, w, h), twilight: (w, h) => deepSea(0.5, w, h), midnight: (w, h) => deepSea(0.7, w, h), floor: (w, h) => deepSea(0.97, w, h) } },
  "personal-portfolio": { seq: (t, w, h) => portfolio(t, w, h), posterAt: 0.12, stills: { orbit: (w, h) => portfolio(0.3, w, h), builder: (w, h) => portfolio(0.05, w, h, "builder"), closer: (w, h) => portfolio(0.02, w, h, "closer") } },
  "luxury-product": { seq: (t, w, h) => watch(t, w, h), posterAt: 0.08, stills: { orbit: (w, h) => watch(0.2, w, h), macro: (w, h) => watch(0, w, h, "macro"), exploded: (w, h) => watch(0.02, w, h, "exploded") } },
  restaurant: { seq: (t, w, h) => fire(t, w, h), posterAt: 0.5, stills: { fire: (w, h) => fire(0.7, w, h), room: (w, h) => fire(0, w, h, "room"), craft: (w, h) => fire(0, w, h, "craft") } },
  "real-estate": { seq: (t, w, h) => tower(t, w, h), posterAt: 0.2, stills: { approach: (w, h) => tower(0.2, w, h), arrival: (w, h) => tower(0.6, w, h), flow: (w, h) => tower(0.72, w, h), terrace: (w, h) => tower(0.98, w, h) } },
  automotive: { seq: (t, w, h) => car(t, w, h), posterAt: 0.12, stills: { reveal: (w, h) => car(0.1, w, h), run: (w, h) => car(0.4, w, h), canyon: (w, h) => car(0.65, w, h), night: (w, h) => car(0.92, w, h) } },
  saas: { seq: (t, w, h) => particles(t, w, h), posterAt: 0.35, stills: { particles: (w, h) => particles(0.4, w, h), signal: (w, h) => particles(0, w, h, "signal"), calm: (w, h) => particles(0, w, h, "calm") } },
  fitness: { seq: (t, w, h) => chalk(t, w, h), posterAt: 0.55, stills: { chalk: (w, h) => chalk(0.6, w, h), iron: (w, h) => chalk(0, w, h, "iron"), grind: (w, h) => chalk(0, w, h, "grind") } },
};

async function render(svg, file, quality) {
  mkdirSync(dirname(file), { recursive: true });
  const buf = await sharp(Buffer.from(svg)).webp({ quality, effort: 4 }).toBuffer();
  await writeFile(file, buf);
  return buf.length;
}

async function pool(tasks, size = 6) {
  const results = [];
  let i = 0;
  const workers = Array.from({ length: size }, async () => {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  });
  await Promise.all(workers);
  return results;
}

function findFfmpeg() {
  if (process.env.FFMPEG_PATH && existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  const which = spawnSync("which", ["ffmpeg"]);
  if (which.status === 0) return which.stdout.toString().trim();
  const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  if (existsSync(pw)) {
    for (const d of readdirSync(pw)) {
      if (d.startsWith("ffmpeg")) {
        const p = join(pw, d, "ffmpeg-linux");
        if (existsSync(p)) return p;
      }
    }
  }
  return null;
}

const dirSize = (dir) => {
  let total = 0;
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else total += st.size;
    }
  };
  if (existsSync(dir)) walk(dir);
  return total;
};

async function main() {
  const ffmpeg = skipVideo ? null : findFfmpeg();
  if (!ffmpeg && !skipVideo) console.warn("ffmpeg introuvable : les previews WebM ne seront pas générées (posters seuls).");
  const D = plan.desktop;
  const M = plan.mobile;
  const report = [];
  for (const [slug, p] of Object.entries(plan.experiences)) {
    if (only && slug !== only) continue;
    const scene = scenes[slug];
    const base = join(outRoot, p.folder);
    const seqDesk = join(base, "seq", plan.version, "desktop");
    const seqMob = join(base, "seq", plan.version, "mobile");
    const n = p.hero.frames;
    console.log(`→ ${slug} (${n} frames)`);
    const tasks = [];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : i / (n - 1);
      const name = `${String(i).padStart(3, "0")}.webp`;
      tasks.push(() => render(svgDoc(D.width, D.height, scene.seq(t, D.width, D.height)), join(seqDesk, name), 70));
      tasks.push(() => render(svgDoc(M.width, M.height, scene.seq(t, M.width, M.height)), join(seqMob, name), 66));
    }
    tasks.push(() => render(svgDoc(D.width, D.height, scene.seq(scene.posterAt, D.width, D.height)), join(base, "poster.webp"), 80));
    tasks.push(() => render(svgDoc(M.width, M.height, scene.seq(scene.posterAt, M.width, M.height)), join(base, "poster-mobile.webp"), 74));
    for (const [id, fn] of Object.entries(scene.stills)) {
      tasks.push(() => render(svgDoc(D.width, D.height, fn(D.width, D.height)), join(base, "stills", `${id}.webp`), 76));
      tasks.push(() => render(svgDoc(M.width, M.height, fn(M.width, M.height)), join(base, "stills", `${id}-mobile.webp`), 70));
    }
    await pool(tasks, 6);
    let preview = null;
    if (ffmpeg) {
      const out = join(base, "preview.webm");
      const fps = 12;
      // Sous-échantillonnage à ~4 s max, puis pipe MJPEG (l'ffmpeg embarqué ne décode pas le WebP).
      const maxFrames = fps * 4;
      const step = Math.max(1, Math.ceil(n / maxFrames));
      const pw = 960;
      const ph = Math.round((pw * D.height) / D.width / 2) * 2;
      const chunks = [];
      for (let i = 0; i < n; i += step) {
        chunks.push(await sharp(join(seqDesk, `${String(i).padStart(3, "0")}.webp`)).resize(pw, ph).jpeg({ quality: 92 }).toBuffer());
      }
      const args = ["-y", "-loglevel", "error", "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", String(fps), "-i", "pipe:0", "-c:v", "libvpx", "-b:v", "650k", "-crf", "14", "-an", "-pix_fmt", "yuv420p", out];
      const res = spawnSync(ffmpeg, args, { input: Buffer.concat(chunks), stdio: ["pipe", "inherit", "inherit"], maxBuffer: 1024 * 1024 * 512 });
      if (res.status === 0) preview = statSync(out).size;
      else console.warn(`  preview non générée pour ${slug}`);
    }
    report.push({ slug, frames: n, seqDesktop: dirSize(seqDesk), seqMobile: dirSize(seqMob), poster: statSync(join(base, "poster.webp")).size, posterMobile: statSync(join(base, "poster-mobile.webp")).size, preview });
  }
  const kb = (b) => (b === null ? "—" : `${(b / 1024).toFixed(0)} Ko`);
  console.log("\nRésumé :");
  for (const r of report) console.log(`${r.slug.padEnd(20)} frames=${String(r.frames).padStart(3)} desktop=${kb(r.seqDesktop).padStart(9)} mobile=${kb(r.seqMobile).padStart(9)} poster=${kb(r.poster)} / ${kb(r.posterMobile)} preview=${kb(r.preview)}`);
  await writeFile(join(outRoot, "placeholder-report.json"), JSON.stringify({ generatedAt: new Date().toISOString(), version: plan.version, report }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
