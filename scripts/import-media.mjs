/**
 * Importe les médias générés avec Higgsfield (Seedance 2.0 / Nano Banana) et produit tous les
 * dérivés attendus par le manifeste, sans toucher aux composants.
 *
 * Entrée : src/content/media-sources.json
 * {
 *   "version": "v2",
 *   "experiences": {
 *     "<slug>": {
 *       "hero": { "clips": ["https://…mp4", …], "mobileClips": ["https://…mp4"], "frames": 96 },
 *       "poster": "https://…png"            (optionnel : sinon première frame du hero)
 *       "stills": { "<id>": "https://…png" },
 *       "scenes": { "<id>": { "clip": "https://…mp4", "frames": 48, "scrollHeight": 260 } }
 *     }
 *   }
 * }
 *
 * Sortie : public/media/<folder>/ (poster, poster-mobile, preview.webm/mp4, hero.mp4, hero-mobile.mp4,
 * seq/<version>/desktop|mobile/NNN.webp, stills/<id>[-mobile].webp) + mise à jour de media-plan.json.
 *
 * Nécessite ffmpeg (libx264, libvpx) et sharp. Conçu pour tourner dans GitHub Actions (ubuntu-latest).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const plan = JSON.parse(readFileSync(join(root, "src/content/media-plan.json"), "utf8"));
const sources = JSON.parse(readFileSync(join(root, "src/content/media-sources.json"), "utf8"));
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const tmp = join(root, ".media-tmp");
mkdirSync(tmp, { recursive: true });

const D = plan.desktop; // 1280x720
const M = plan.mobile; // 540x960
const version = sources.version ?? "v2";

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1024 * 1024 * 64, ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")}\n${r.stderr?.toString().slice(-2000)}`);
  return r.stdout?.toString() ?? "";
};
const download = (url, file) => {
  if (existsSync(file) && statSync(file).size > 0) return file;
  run("curl", ["-sS", "-L", "-f", "--retry", "3", "-o", file, url]);
  return file;
};
const probeDuration = (file) => Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).trim());
const pad = (i) => String(i).padStart(3, "0");
const dirSize = (dir) => {
  let t = 0;
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      const s = statSync(p);
      s.isDirectory() ? walk(p) : (t += s.size);
    }
  };
  if (existsSync(dir)) walk(dir);
  return t;
};

/** Concatène les clips (ré-encodage uniforme 1080p) puis renvoie le chemin du master. */
function concatClips(urls, name) {
  const files = urls.map((u, i) => download(u, join(tmp, `${name}-${i}.mp4`)));
  const master = join(tmp, `${name}-master.mp4`);
  if (files.length === 1) return files[0];
  const list = join(tmp, `${name}-list.txt`);
  writeFileSync(list, files.map((f) => `file '${f}'`).join("\n"));
  run("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", master]);
  return master;
}

/** Extrait N frames réparties uniformément et les convertit en WebP au format cible. */
async function extractFrames(master, outDir, count, w, h, quality) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const dur = probeDuration(master);
  const fps = count / dur;
  const raw = join(tmp, `frames-${outDir.replace(/[^a-z0-9]/gi, "_")}`);
  rmSync(raw, { recursive: true, force: true });
  mkdirSync(raw, { recursive: true });
  // scale+crop "cover" vers w×h, puis échantillonnage uniforme.
  const vf = `fps=${fps.toFixed(6)},scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h}`;
  run("ffmpeg", ["-y", "-loglevel", "error", "-i", master, "-vf", vf, "-frames:v", String(count), "-q:v", "2", join(raw, "%03d.png")]);
  const pngs = readdirSync(raw).filter((f) => f.endsWith(".png")).sort();
  const n = Math.min(count, pngs.length);
  for (let i = 0; i < n; i++) {
    await sharp(join(raw, pngs[i])).webp({ quality, effort: 4 }).toFile(join(outDir, `${pad(i)}.webp`));
  }
  return n;
}

async function importExperience(slug, src) {
  const p = plan.experiences[slug];
  if (!p) throw new Error(`slug inconnu : ${slug}`);
  const base = join(root, "public/media", p.folder);
  mkdirSync(base, { recursive: true });
  console.log(`→ ${slug}`);
  const report = { slug, version };

  // --- Hero desktop ---
  let frames = p.hero.frames;
  if (src.hero?.clips?.length) {
    const master = concatClips(src.hero.clips, `${slug}-desktop`);
    const target = src.hero.frames ?? Math.min(160, Math.round(probeDuration(master) * 9));
    frames = await extractFrames(master, join(base, "seq", version, "desktop"), target, D.width, D.height, 72);
    // Fallback vidéo 720p H.264 + preview WebM 4 s
    run("ffmpeg", ["-y", "-loglevel", "error", "-i", master, "-vf", "scale=1280:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", join(base, "hero.mp4")]);
    run("ffmpeg", ["-y", "-loglevel", "error", "-i", master, "-t", "4.5", "-vf", "scale=960:-2,fps=24", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-an", join(base, "preview.webm")]);
    run("ffmpeg", ["-y", "-loglevel", "error", "-i", master, "-t", "4.5", "-vf", "scale=960:-2,fps=24", "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", join(base, "preview.mp4")]);
    // Poster : image dédiée ou frame à 15 %
    if (src.poster) {
      const f = download(src.poster, join(tmp, `${slug}-poster.png`));
      await sharp(f).resize(D.width, D.height, { fit: "cover" }).webp({ quality: 82 }).toFile(join(base, "poster.webp"));
      await sharp(f).resize(M.width, M.height, { fit: "cover", position: "centre" }).webp({ quality: 76 }).toFile(join(base, "poster-mobile.webp"));
    } else {
      const idx = Math.round(frames * 0.15);
      await sharp(join(base, "seq", version, "desktop", `${pad(idx)}.webp`)).webp({ quality: 82 }).toFile(join(base, "poster.webp"));
      await sharp(join(base, "seq", version, "desktop", `${pad(idx)}.webp`)).resize(M.width, M.height, { fit: "cover" }).webp({ quality: 76 }).toFile(join(base, "poster-mobile.webp"));
    }
    // --- Hero mobile : clips 9:16 dédiés, sinon recadrage du master ---
    const mobileMaster = src.hero.mobileClips?.length ? concatClips(src.hero.mobileClips, `${slug}-mobile`) : master;
    const mframes = await extractFrames(mobileMaster, join(base, "seq", version, "mobile"), frames, M.width, M.height, 66);
    if (mframes !== frames) throw new Error(`frames mobile (${mframes}) ≠ desktop (${frames}) pour ${slug}`);
    if (src.hero.mobileClips?.length) {
      run("ffmpeg", ["-y", "-loglevel", "error", "-i", mobileMaster, "-vf", "scale=720:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-an", "-movflags", "+faststart", join(base, "hero-mobile.mp4")]);
    }
    p.hero.frames = frames;
    p.hero.status = "generated";
    report.frames = frames;
    report.hero = dirSize(join(base, "seq", version, "desktop"));
    report.heroMobile = dirSize(join(base, "seq", version, "mobile"));
    report.preview = statSync(join(base, "preview.webm")).size;
    report.heroMp4 = statSync(join(base, "hero.mp4")).size;
  }

  // --- Scènes secondaires (macro, builder, craft…) : séquence courte desktop + mobile ---
  if (src.scenes) {
    p.scenes = p.scenes ?? {};
    for (const [id, sc] of Object.entries(src.scenes)) {
      const master = concatClips([sc.clip], `${slug}-scene-${id}`);
      const target = sc.frames ?? 48;
      const n = await extractFrames(master, join(base, "seq", version, id, "desktop"), target, D.width, D.height, 70);
      const m = await extractFrames(master, join(base, "seq", version, id, "mobile"), n, M.width, M.height, 64);
      if (m !== n) throw new Error(`frames mobile (${m}) ≠ desktop (${n}) pour ${slug}:${id}`);
      p.scenes[id] = { frames: n, status: "generated", scrollHeight: sc.scrollHeight ?? 260 };
      if (!p.stills.includes(id)) p.stills.push(id);
      if (!src.stills?.[id]) {
        mkdirSync(join(base, "stills"), { recursive: true });
        await sharp(join(base, "seq", version, id, "desktop", "000.webp")).webp({ quality: 78 }).toFile(join(base, "stills", `${id}.webp`));
        await sharp(join(base, "seq", version, id, "mobile", "000.webp")).webp({ quality: 72 }).toFile(join(base, "stills", `${id}-mobile.webp`));
      }
    }
    report.scenes = Object.keys(src.scenes);
  }

  // --- Stills ---
  if (src.stills) {
    mkdirSync(join(base, "stills"), { recursive: true });
    for (const [id, url] of Object.entries(src.stills)) {
      const f = download(url, join(tmp, `${slug}-still-${id}.png`));
      await sharp(f).resize(D.width, D.height, { fit: "cover" }).webp({ quality: 78 }).toFile(join(base, "stills", `${id}.webp`));
      await sharp(f).resize(M.width, M.height, { fit: "cover" }).webp({ quality: 72 }).toFile(join(base, "stills", `${id}-mobile.webp`));
      if (!p.stills.includes(id)) p.stills.push(id);
    }
    report.stills = Object.keys(src.stills);
  }
  return report;
}

async function main() {
  const reports = [];
  for (const [slug, src] of Object.entries(sources.experiences ?? {})) {
    if (only && slug !== only) continue;
    reports.push(await importExperience(slug, src));
  }
  if (reports.some((r) => r.frames)) plan.version = version;
  writeFileSync(join(root, "src/content/media-plan.json"), JSON.stringify(plan, null, 2) + "\n");
  writeFileSync(join(root, "MEDIA_MANIFEST.generated.json"), JSON.stringify({ generatedAt: new Date().toISOString(), version, reports }, null, 2) + "\n");
  const kb = (b) => (b ? `${(b / 1024).toFixed(0)} Ko` : "—");
  for (const r of reports) console.log(`${r.slug.padEnd(20)} frames=${r.frames ?? "—"} hero=${kb(r.hero)} mobile=${kb(r.heroMobile)} preview=${kb(r.preview)} mp4=${kb(r.heroMp4)} stills=${(r.stills ?? []).join(",")}`);
  rmSync(tmp, { recursive: true, force: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
