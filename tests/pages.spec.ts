import { test, expect } from "@playwright/test";
import { collectConsoleErrors, isRealError, editorialPages, expectNoHorizontalOverflow } from "./helpers";

for (const path of editorialPages) {
  test(`page ${path} : un seul H1, navigation, aucun overflow, aucune erreur console`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("header nav").first()).toBeAttached();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("a.skip-link")).toHaveAttribute("href", "#main");
    await expectNoHorizontalOverflow(page);
    expect(errors.filter(isRealError)).toEqual([]);
  });
}

test("sitemap et robots", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  expect(xml).toContain("/experiences/deep-sea-journey");
  expect(xml).toContain("/experiences/fitness");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Sitemap:");
});

test("métadonnées uniques par expérience", async ({ request }) => {
  const a = await (await request.get("/experiences/deep-sea-journey")).text();
  const b = await (await request.get("/experiences/saas")).text();
  const titleA = a.match(/<title>(.*?)<\/title>/)?.[1];
  const titleB = b.match(/<title>(.*?)<\/title>/)?.[1];
  expect(titleA).toBeTruthy();
  expect(titleA).not.toEqual(titleB);
  expect(a).toContain('rel="canonical"');
  expect(a).toContain('property="og:title"');
  expect(a).toContain("application/ld+json");
});

test("en-têtes de sécurité", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["content-security-policy"]).toContain("default-src 'self'");
});

test("formulaire de contact : validation, erreurs accessibles, fallback annoncé", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Présenter mon projet" }).click();
  await expect(page.locator("[aria-invalid='true']").first()).toBeVisible();
  await expect(page.locator(".field-error").first()).toBeVisible();
  await page.getByLabel("Nom *").fill("Test Playwright");
  await page.getByLabel("E-mail *").fill("test@example.com");
  await page.getByLabel("Votre projet *").fill("Un projet de test suffisamment long.");
  await page.waitForTimeout(2100); // délai anti-automate côté serveur
  await page.getByRole("button", { name: "Présenter mon projet" }).click();
  const status = page.locator("[role='status']").first();
  await expect(status).toContainText(/configuré|envoyé|Ouvrir mon client/i, { timeout: 15_000 });
});

test("API contact : honeypot et validation serveur", async ({ request }) => {
  const bad = await request.post("/api/contact", { data: { name: "A", email: "nope", message: "court", startedAt: Date.now() - 5000 } });
  expect(bad.status()).toBe(422);
  const bot = await request.post("/api/contact", { data: { name: "Bot", email: "bot@example.com", message: "Message de robot assez long.", website: "http://spam", startedAt: Date.now() - 5000 } });
  expect(bot.status()).toBe(200);
  const ok = await request.post("/api/contact", { data: { name: "Humain", email: "h@example.com", message: "Message humain assez long.", startedAt: Date.now() - 5000 } });
  // Sans service e-mail configuré : 503 + fallback (ou 200 si configuré)
  expect([200, 503]).toContain(ok.status());
  const json = (await ok.json()) as { ok: boolean; fallback?: string };
  if (ok.status() === 503) expect(json.ok).toBe(false);
});
