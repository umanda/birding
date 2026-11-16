import type { Page } from '@playwright/test';

// Resolves once the worker has installed (precache complete), activated and controls the page.
export async function waitForServiceWorkerControl(page: Page): Promise<void> {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
}

// Full-size photos are cached on first view or by the offline pack, not precached (ADR 0004),
// so an offline request for one that was never downloaded is expected to fail; the gallery
// then falls back to the thumbnail. Every other offline request must succeed.
const UNDOWNLOADED_FULL_PHOTO = /\/media\/.+\.full\.webp$/;

export function isUnexpectedOfflineFailure(url: string): boolean {
  return !UNDOWNLOADED_FULL_PHOTO.test(new URL(url).pathname);
}
