import { test, expect } from "@playwright/test";

test("navigation clavier : lien d'évitement, focus visible, menu", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "clavier desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.locator("a.skip-link");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  // Les liens de navigation sont atteignables
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(["A", "BUTTON"]).toContain(focused);
});

test("boutons et liens : cibles tactiles ≥ 44 px sur mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile uniquement");
  await page.goto("/experiences/fitness");
  const targets = page.locator("a.btn, button.btn, header button");
  const n = await targets.count();
  for (let i = 0; i < n; i++) {
    const box = await targets.nth(i).boundingBox();
    if (box && box.height > 0) expect(box.height, `cible ${i}`).toBeGreaterThanOrEqual(44);
  }
});

test("formulaires : labels associés et statut accessible", async ({ page }) => {
  await page.goto("/experiences/restaurant");
  const form = page.locator("form").first();
  await form.scrollIntoViewIfNeeded();
  const inputs = form.locator("input:not([type=hidden]):not([name=website]), select, textarea");
  const n = await inputs.count();
  expect(n).toBeGreaterThan(3);
  for (let i = 0; i < n; i++) {
    const id = await inputs.nth(i).getAttribute("id");
    expect(id).toBeTruthy();
    await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
  }
  await expect(form.locator("[role='status']")).toBeAttached();
});

test("médias décoratifs masqués des lecteurs d'écran", async ({ page }) => {
  await page.goto("/experiences/deep-sea-journey");
  const canvasWrap = page.locator("[data-chapter] canvas").locator("..");
  if ((await canvasWrap.count()) > 0) await expect(canvasWrap).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("video[aria-hidden='true']").first()).toHaveCount(0); // pas de vidéo hero
});
