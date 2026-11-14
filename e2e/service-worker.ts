import type { Page } from '@playwright/test';

// Resolves once the worker has installed (precache complete), activated and controls the page.
export async function waitForServiceWorkerControl(page: Page): Promise<void> {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
}
