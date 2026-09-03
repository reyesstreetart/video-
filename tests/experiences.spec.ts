import { test, expect } from "@playwright/test";
import { collectConsoleErrors, isRealError, slugs, chapterProgress, scrollChapterTo, canvasHasImage, expectNoHorizontalOverflow } from "./helpers";

const brands: Record<(typeof slugs)[number], string> = {
  "deep-sea-journey": "ABYSSAL",
  "personal-portfolio": "Alex Rivière",
  "luxury-product": "AURUM & NOIR",
  restaurant: "EMBER",
  "real-estate": "THE MERIDIAN",
  automotive: "VANTA",
  saas: "Voyez le churn arriver.",
  fitness: "FORGE",
};

for (const slug of slugs) {
  test.describe(`Expérience ${slug}`, () => {
    test("page, H1 unique, mention fictive, savoir-faire, scroll réversible, canvas non vide", async ({ page }) => {
      const errors = collectConsoleErrors(page);
      const res = await page.goto(`/experiences/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toContainText(brands[slug]);
      await expect(page.getByText("Concept expérimental MV Design").first()).toBeAttached();
      await expect(page.getByRole("heading", { name: "Ce que MV Design a mis en scène." })).toBeAttached();
      await expect(page.locator("a", { hasText: "Passer l’animation" }).first()).toBeAttached();
      await page.waitForFunction(() => document.querySelector("[data-chapter]")?.getAttribute("data-ready") === "true");

      // Première frame
      expect(await chapterProgress(page)).toBeLessThanOrEqual(0.01);
      // Avancement au scroll
      await scrollChapterTo(page, 0.5);
      const mid = await chapterProgress(page);
      expect(mid).toBeGreaterThan(0.45);
      expect(mid).toBeLessThan(0.55);
      // Dernière frame
      await scrollChapterTo(page, 1);
      expect(await chapterProgress(page)).toBeGreaterThanOrEqual(0.99);
      // Recul immédiat
      await scrollChapterTo(page, 0.25);
      const back = await chapterProgress(page);
      expect(back).toBeGreaterThan(0.2);
      expect(back).toBeLessThan(0.3);
      // Déplacement rapide de la scrollbar (saut)
      await scrollChapterTo(page, 0.9);
      expect(await chapterProgress(page)).toBeGreaterThan(0.85);

      // Canvas non vide (si séquence présente) : attendre le décodage
      const hasCanvas = (await page.locator("[data-chapter] canvas").count()) > 0;
      if (hasCanvas) {
        await page.waitForFunction(() => {
          const c = document.querySelector<HTMLCanvasElement>("[data-chapter] canvas");
          return !!c && c.width > 0;
        });
        await page.waitForTimeout(1200);
        const state = await canvasHasImage(page);
        expect(state.ok, `canvas uniforme ou vide (moyenne ${state.mean})`).toBe(true);
      } else {
        // Fallback : le poster doit être présent
        await expect(page.locator("[data-chapter] img").first()).toBeAttached();
      }
      await expectNoHorizontalOverflow(page);
      expect(errors.filter(isRealError)).toEqual([]);
    });

    test("rechargement au milieu d'une scène : progression restaurée sans écran noir", async ({ page }) => {
      await page.goto(`/experiences/${slug}`);
      await page.waitForFunction(() => document.querySelector("[data-chapter]")?.getAttribute("data-ready") === "true");
      await scrollChapterTo(page, 0.6);
      const y = await page.evaluate(() => window.scrollY);
      await page.reload();
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" as ScrollBehavior }), y);
      await page.waitForFunction(() => document.querySelector("[data-chapter]")?.getAttribute("data-ready") === "true");
      await page.waitForTimeout(400);
      const p = await chapterProgress(page);
      expect(p).toBeGreaterThan(0.5);
      const hasCanvas = (await page.locator("[data-chapter] canvas").count()) > 0;
      if (hasCanvas) {
        await page.waitForTimeout(1200);
        const state = await canvasHasImage(page);
        expect(state.ok).toBe(true);
      }
    });

    test("clavier : la page défile avec les flèches et la barre d'espace", async ({ page, isMobile }) => {
      test.skip(!!isMobile, "pas de clavier sur mobile");
      await page.goto(`/experiences/${slug}`);
      await page.locator("body").click({ position: { x: 5, y: 5 } });
      const y0 = await page.evaluate(() => window.scrollY);
      await page.keyboard.press("PageDown");
      await page.waitForTimeout(400);
      const y1 = await page.evaluate(() => window.scrollY);
      expect(y1).toBeGreaterThan(y0);
      await page.keyboard.press("ArrowUp");
      await page.waitForTimeout(400);
      const y2 = await page.evaluate(() => window.scrollY);
      expect(y2).toBeLessThan(y1);
    });
  });
}

test.describe("Mode mouvement réduit", () => {
  test.use({ reducedMotion: "reduce" });
  test("le mode static affiche les posters, le texte et les CTA sans canvas", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    // Émulation explicite en plus de test.use : certains Chromium préinstallés n'appliquent pas l'option de contexte.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/experiences/deep-sea-journey");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "static");
    await expect(page.locator("[data-chapter] canvas")).toHaveCount(0);
    await expect(page.locator("[data-chapter] img").first()).toBeAttached();
    await expect(page.locator("h1")).toContainText("ABYSSAL");
    await expect(page.getByRole("link", { name: "Rejoindre le manifeste" }).first()).toBeVisible();
    expect(errors.filter(isRealError)).toEqual([]);
  });
});

test.describe("Fallback média manquant", () => {
  test("une séquence absente ne produit pas d'écran vide : le poster reste affiché", async ({ page }) => {
    // Bloque toutes les frames : le canvas doit continuer d'afficher le poster.
    await page.route("**/seq/**", (route) => route.abort());
    await page.goto("/experiences/luxury-product");
    await page.waitForFunction(() => document.querySelector("[data-chapter]")?.getAttribute("data-ready") === "true");
    await page.waitForTimeout(1500);
    // Soit le canvas a le poster dessiné, soit la page a basculé en fallback (img).
    const canvas = page.locator("[data-chapter] canvas");
    if ((await canvas.count()) > 0) {
      const state = await canvasHasImage(page);
      expect(state.ok).toBe(true);
    } else {
      await expect(page.locator("[data-chapter] img").first()).toBeVisible();
    }
    await expect(page.locator("h1")).toBeVisible();
  });

  test("un poster de carte absent laisse la carte lisible", async ({ page }) => {
    await page.route("**/media/03-luxury-product/poster.webp", (route) => route.abort());
    await page.goto("/");
    const card = page.locator("[data-experience-index] > li").nth(2);
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText("Révéler l’invisible.");
    await expect(card.getByRole("link", { name: "Traverser l’expérience" })).toBeVisible();
  });
});

test.describe("Rotation portrait/paysage", () => {
  test("changement d'orientation sans erreur ni flash", async ({ page, browserName }) => {
    test.skip(browserName === "firefox", "setViewportSize suffit ; Firefox ne supporte pas l'émulation mobile");
    const errors = collectConsoleErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/experiences/automotive");
    await page.waitForFunction(() => document.querySelector("[data-chapter]")?.getAttribute("data-ready") === "true");
    await scrollChapterTo(page, 0.4);
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(800);
    await scrollChapterTo(page, 0.5);
    await page.waitForTimeout(800);
    if ((await page.locator("[data-chapter] canvas").count()) > 0) {
      const state = await canvasHasImage(page);
      expect(state.ok).toBe(true);
    }
    expect(errors.filter(isRealError)).toEqual([]);
  });
});
