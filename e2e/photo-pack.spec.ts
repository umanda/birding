import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from '@playwright/test';
import sharp from 'sharp';
import ts from 'typescript';

import type { PhotoPack } from '../src/shared/platform/photo-pack';

import { waitForServiceWorkerControl } from './service-worker';

const DIST_DIR = path.join(__dirname, '..', 'dist');
const FIXTURE_URL = '/media/e2e-pack/fixture.4567abcd.full.webp';
const DOWNLOADER_SOURCE = path.join(__dirname, '..', 'src/shared/platform/photo-pack.web.ts');

// The real manifest is empty until photos are ingested, so the Me screen has nothing to list.
// The real web downloader is compiled and run in the page against a fixture photo instead.
test.beforeAll(async () => {
  const file = path.join(DIST_DIR, FIXTURE_URL);
  mkdirSync(path.dirname(file), { recursive: true });
  const pixel = { create: { width: 1, height: 1, channels: 3 as const, background: '#363' } };
  writeFileSync(file, await sharp(pixel).webp().toBuffer());
});

test.afterAll(() => {
  rmSync(path.join(DIST_DIR, path.dirname(FIXTURE_URL)), { recursive: true, force: true });
});

test('the photo pack downloader saves a photo that then loads offline', async ({
  page,
  context,
}) => {
  const compiled = ts.transpileModule(readFileSync(DOWNLOADER_SOURCE, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  await page.goto('/');
  await waitForServiceWorkerControl(page);

  const result = await page.evaluate(
    async ({ code, url }) => {
      const exports = {} as { photoPack: PhotoPack };
      new Function('exports', code)(exports);
      const pack = exports.photoPack;
      const outcome = await pack.download([url], {
        signal: new AbortController().signal,
        onProgress: () => undefined,
      });
      return { outcome, cached: [...(await pack.listCachedUrls())] };
    },
    { code: compiled, url: FIXTURE_URL },
  );
  expect(result).toEqual({ outcome: 'done', cached: [FIXTURE_URL] });

  await context.setOffline(true);
  const status = await page.evaluate(async (url) => (await fetch(url)).status, FIXTURE_URL);
  expect(status).toBe(200);
});
