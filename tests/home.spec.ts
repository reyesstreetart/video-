import { test, expect } from "@playwright/test";
import { collectConsoleErrors, isRealError, expectNoHorizontalOverflow, slugs } from "./helpers";

test.describe("Accueil", () => {
  test("hero, manifeste, index des huit expériences et mentions fictives", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("On les traverse.");
    await expect(page.getByRole("link", { name: "Explorer les 8 expériences" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Présenter mon projet" }).first()).toBeVisible();

    const cards = page.locator("[data-experience-index] > li");
    await expect(cards).toHaveCount(8);
    for (let i = 0; i < slugs.length; i++) {
      const card = cards.nth(i);
      await expect(card).toContainText(String(i + 1).padStart(2, "0"));
      await expect(card).toContainText("Concept expérimental MV Design");
      await expect(card.locator(`a[href="/experiences/${slugs[i]}"]`).first()).toHaveCount(1);
    }
    // Ordre imposé des secteurs
    const sectors = ["Expérience et storytelling", "Portfolio personnel", "Produit de luxe", "Restaurant", "Immobilier", "Automobile", "SaaS", "Fitness"];
    for (let i = 0; i < sectors.length; i++) await expect(cards.nth(i)).toContainText(sectors[i]!);

    await expect(page.getByText("IMMERSIF.")).toBeVisible();
    await page.getByText("MÉMORABLE.").scrollIntoViewIfNeeded();
    await expect(page.getByText("MÉMORABLE.")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(errors.filter(isRealError)).toEqual([]);
  });

  test("une seule preview vidéo joue à la fois", async ({ page, isMobile }) => {
    await page.goto("/");
    const cards = page.locator("[data-experience-index] > li article");
    await cards.first().scrollIntoViewIfNeeded();
    if (!isMobile) {
      await cards.nth(0).hover();
      await page.waitForTimeout(600);
      await cards.nth(1).scrollIntoViewIfNeeded();
      await cards.nth(1).hover();
      await page.waitForTimeout(800);
    } else {
      await cards.nth(1).scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
    }
    const playing = await page.evaluate(() => Array.from(document.querySelectorAll("video")).filter((v) => !v.paused && !v.ended).length);
    expect(playing).toBeLessThanOrEqual(1);
  });

  test("le hero avance au scroll et recule immédiatement", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(() => document.querySelector("[data-chapter]")?.getAttribute("data-ready") === "true");
    const p0 = await page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-chapter]")!.style.getPropertyValue("--p")));
    expect(p0).toBeLessThanOrEqual(0.01);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(250);
    const p1 = await page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-chapter]")!.style.getPropertyValue("--p")));
    expect(p1).toBeGreaterThan(p0);
    await page.mouse.wheel(0, -900);
    await page.waitForTimeout(250);
    const p2 = await page.evaluate(() => Number(document.querySelector<HTMLElement>("[data-chapter]")!.style.getPropertyValue("--p")));
    expect(p2).toBeLessThan(p1);
  });
});
