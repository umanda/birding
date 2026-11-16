import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';
import sharp from 'sharp';

import { waitForServiceWorkerControl } from './service-worker';

const PHOTO_CACHE_NAME = 'photos-v1';
const FIXTURE_FULL_URL = '/media/e2e-fixture/fixture.0123abcd.full.webp';

// The real media manifest is bundled into the JS and is empty until photos are ingested, so the
// gallery cannot be driven end to end yet. One tiny photo written into the git-ignored dist/
// exercises the worker's runtime photo cache without touching committed content.
test.beforeAll(async () => {
  const file = path.join('dist', FIXTURE_FULL_URL);
  mkdirSync(path.dirname(file), { recursive: true });
  const pixel = { create: { width: 1, height: 1, channels: 3 as const, background: '#336' } };
  writeFileSync(file, await sharp(pixel).webp().toBuffer());
});

test('a full photo fetched online is served from photos-v1 when offline', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await waitForServiceWorkerControl(page);
  const fetchStatus = (): Promise<number> =>
    page.evaluate(async (url) => (await fetch(url)).status, FIXTURE_FULL_URL);
  const isCached = (): Promise<boolean> =>
    page.evaluate(
      async ({ cacheName, url }) => (await (await caches.open(cacheName)).match(url)) !== undefined,
      { cacheName: PHOTO_CACHE_NAME, url: FIXTURE_FULL_URL },
    );

  expect(await fetchStatus()).toBe(200);
  await expect.poll(isCached).toBe(true);

  await context.setOffline(true);
  expect(await fetchStatus()).toBe(200);
});
