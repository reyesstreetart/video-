import { expect, type Page } from "@playwright/test";

export const slugs = ["deep-sea-journey", "personal-portfolio", "luxury-product", "restaurant", "real-estate", "automotive", "saas", "fitness"] as const;

export const editorialPages = ["/", "/experiences", "/expertise", "/methode", "/studio", "/contact", "/mentions-legales", "/confidentialite"] as const;

/** Collecte les erreurs console et les exceptions de page. */
export function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("requestfailed", (req) => {
    // Une preview vidéo ou une frame absente ne doit pas casser la page, mais on la remonte.
    if (/\/media\//.test(req.url())) errors.push(`requestfailed: ${req.url()} ${req.failure()?.errorText ?? ""}`);
  });
  return errors;
}

/** Filtre les erreurs tolérées (aucune pour l'instant : toute erreur est signalée). */
export const isRealError = (e: string) => !/favicon/.test(e);

/** Progression courante du premier chapitre (variable CSS --p). */
export async function chapterProgress(page: Page, index = 0) {
  return page.evaluate((i) => {
    const el = document.querySelectorAll<HTMLElement>("[data-chapter]")[i];
    return el ? Number(el.style.getPropertyValue("--p") || 0) : -1;
  }, index);
}

/** Position de scroll correspondant à une progression du chapitre. */
export async function scrollChapterTo(page: Page, progress: number, index = 0) {
  await page.evaluate(
    ({ i, p }) => {
      const el = document.querySelectorAll<HTMLElement>("[data-chapter]")[i];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const sticky = el.querySelector<HTMLElement>(":scope > div");
      const stickyH = sticky ? sticky.getBoundingClientRect().height : window.innerHeight;
      const travel = rect.height - stickyH;
      window.scrollTo({ top: top + travel * p, behavior: "instant" as ScrollBehavior });
    },
    { i: index, p: progress },
  );
  await page.waitForTimeout(120);
}

/** Vérifie que le canvas de la scène a un contenu non uniforme (ni noir, ni blanc). */
export async function canvasHasImage(page: Page) {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("[data-chapter] canvas");
    if (!canvas) return { present: false, ok: false, mean: -1 };
    const ctx = canvas.getContext("2d");
    if (!ctx || canvas.width === 0) return { present: true, ok: false, mean: -1 };
    const w = canvas.width;
    const h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;
    let sum = 0;
    let n = 0;
    let min = 255;
    let max = 0;
    for (let i = 0; i < data.length; i += 4 * 97) {
      const l = (data[i]! + data[i + 1]! + data[i + 2]!) / 3;
      sum += l;
      n++;
      if (l < min) min = l;
      if (l > max) max = l;
    }
    const mean = sum / n;
    // Ni tout noir (<2), ni tout blanc (>253), et une vraie variation.
    return { present: true, ok: mean > 2 && mean < 253 && max - min > 12, mean };
  });
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "overflow horizontal").toBeLessThanOrEqual(1);
}
