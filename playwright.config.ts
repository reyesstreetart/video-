import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${PORT}`;

/**
 * Projets : Chromium, Firefox et WebKit sur les quatre viewports demandés.
 * Les navigateurs absents de la machine sont ignorés avec `PW_BROWSERS=chromium`.
 */
const wanted = (process.env.PW_BROWSERS ?? "chromium,firefox,webkit").split(",");

const viewports = [
  { name: "desktop-1440", viewport: { width: 1440, height: 900 } },
  { name: "laptop-1024", viewport: { width: 1024, height: 768 } },
  { name: "tablet-768", viewport: { width: 768, height: 1024 } },
  { name: "mobile-390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
] as const;

/**
 * Exécutable Chromium local (environnements où `playwright install` est interdit) :
 * PW_CHROMIUM_EXECUTABLE=/chemin/vers/chrome, sinon auto-détection de /opt/pw-browsers/chromium.
 */
const chromiumExecutable =
  process.env.PW_CHROMIUM_EXECUTABLE ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

const engines = {
  chromium: { ...devices["Desktop Chrome"], ...(chromiumExecutable ? { launchOptions: { executablePath: chromiumExecutable } } : {}) },
  firefox: devices["Desktop Firefox"],
  webkit: devices["Desktop Safari"],
} as const;

const projects = [];
for (const engine of wanted as (keyof typeof engines)[]) {
  if (!engines[engine]) continue;
  for (const vp of viewports) {
    projects.push({
      name: `${engine}-${vp.name}`,
      use: {
        ...engines[engine],
        viewport: vp.viewport,
        // Firefox ne supporte pas l'émulation mobile de Playwright.
        ...(engine !== "firefox" && "isMobile" in vp ? { isMobile: vp.isMobile, hasTouch: vp.hasTouch } : {}),
      },
    });
  }
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects,
  webServer: {
    command: process.env.PW_DEV ? `npm run dev -- -p ${PORT}` : `npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Les suites appellent l'API contact depuis une seule IP : on relève la limite pour les tests.
    env: { CONTACT_RATE_LIMIT_MAX: "10000" },
  },
});
