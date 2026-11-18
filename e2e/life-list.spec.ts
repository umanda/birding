import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import content from '../content/content.json';
import { isUnexpectedOfflineFailure, waitForServiceWorkerControl } from './service-worker';

const ENDEMIC_ID = 'slb-gallus-lafayettii'; // Sri Lanka Junglefowl, plate 1
const endemic = content.species.find((s) => s.species_id === ENDEMIC_ID);
if (!endemic) throw new Error(`${ENDEMIC_ID} missing from content.json`);
const ENDEMIC_NAME = endemic.names.en;
const ENDEMIC_TOTAL = content.species.filter((s) => s.occurrence_code === 'E').length;

const PLACE = 'Sinharaja';
const ZONE = /^Wet lowlands/;
const SAVED = 'Saved on this device';
const SEEN_ONCE = /^Seen 1 time · last /;
const EMPTY_LIST = 'Your list is empty. Find a bird to add.';
const STORAGE_BLOCKED = "Sightings can't be saved on this device right now.";

// React recovers from a hydration mismatch by re-rendering, and offline-reload.spec.ts already
// treats it as expected on the species template. Here it is allowed on /species/* only.
// #98: /me logs the same #418 on load. Allowed on /me only, so it cannot hide the error on other
// pages. Remove the /me entry once #98 is fixed.
const HYDRATION_ERROR = /Minified React error #418/;
const HYDRATION_ALLOWED_PATH = /^\/(me|species\/[^/]+)$/;

type Watch = { pageErrors: string[]; failedRequests: string[] };

// Collects problems from every page the test visits; call before the first navigation.
function watchForProblems(page: Page): Watch {
  const watch: Watch = { pageErrors: [], failedRequests: [] };
  page.on('pageerror', (error) => {
    const allowed = HYDRATION_ALLOWED_PATH.test(new URL(page.url()).pathname);
    if (allowed && HYDRATION_ERROR.test(error.message)) return;
    watch.pageErrors.push(`${page.url()}: ${error.message}`);
  });
  page.on('requestfailed', (request) => {
    if (isUnexpectedOfflineFailure(request.url())) watch.failedRequests.push(request.url());
  });
  return watch;
}

async function openSpecies(page: Page): Promise<void> {
  await page.goto(`/species/${ENDEMIC_ID}`);
  await expect(page.getByRole('heading', { name: ENDEMIC_NAME })).toBeVisible();
}

// The species page sits above the tab bar, so go back to the tabs client-side (no reload) first.
async function openTab(page: Page, name: string): Promise<void> {
  const back = page.getByRole('link', { name: /back$/ });
  if (await back.isVisible()) await back.click();
  await page.getByRole('tab', { name }).click();
}

// Starts online so the service worker can precache, then stays offline for the rest of the test.
async function startOffline(page: Page): Promise<void> {
  await page.goto('/');
  await waitForServiceWorkerControl(page);
  await page.context().setOffline(true);
}

async function fillDetails(page: Page): Promise<void> {
  await page.getByLabel('Place (optional)').fill(PLACE);
  await page.getByRole('radio', { name: ZONE }).click();
  await page.getByLabel('How many (optional)').fill('3');
}

async function saveSighting(page: Page, button: string, withDetails = false): Promise<void> {
  await page.getByRole('button', { name: button, exact: true }).click();
  if (withDetails) await fillDetails(page);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText(SAVED, { exact: true })).toBeVisible();
}

test.describe('life list offline', () => {
  test('keeps an offline sighting after a reload and counts the endemic', async ({ page }) => {
    const watch = watchForProblems(page);
    await startOffline(page);

    await openSpecies(page);
    await saveSighting(page, 'I saw this', true);
    await expect(page.getByText(SEEN_ONCE)).toBeVisible();
    await page.reload();

    await expect(page.getByText(SEEN_ONCE)).toBeVisible();
    await expect(page.getByText(PLACE, { exact: true })).toBeVisible();
    await openTab(page, 'Life list');
    await expect(page.getByText('1 species', { exact: true })).toBeVisible();
    await expect(page.getByText(`Endemics 1 of ${ENDEMIC_TOTAL}`)).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(ENDEMIC_NAME) })).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
    expect(watch.failedRequests).toEqual([]);
  });

  test('shows an edited sighting on the species page and in the Life list', async ({ page }) => {
    const watch = watchForProblems(page);
    await startOffline(page);
    await openSpecies(page);
    await saveSighting(page, 'I saw this', true);

    await page.getByRole('button', { name: /^Edit sighting from/ }).click();
    await page.getByLabel('Place (optional)').fill('Yala');
    await page.getByLabel('Date (YYYY-MM-DD)').fill('2026-03-05');
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    await expect(page.getByText('Yala', { exact: true })).toBeVisible();
    await expect(page.getByText(PLACE, { exact: true })).toHaveCount(0);
    await openTab(page, 'Life list');
    await expect(
      page.getByText('First 5 March 2026 · Last 5 March 2026 · 1 sighting'),
    ).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
  });

  test('deletes one sighting after an inline confirmation', async ({ page }) => {
    const watch = watchForProblems(page);
    await startOffline(page);
    await openSpecies(page);
    await saveSighting(page, 'I saw this');

    await page.getByRole('button', { name: /^Delete sighting from/ }).click();
    await page.getByRole('button', { name: /^Yes, delete sighting from/ }).click();

    await expect(page.getByText('Sighting deleted')).toBeVisible();
    await expect(page.getByText(SEEN_ONCE)).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Your sightings' })).toHaveCount(0);
    await openTab(page, 'Life list');
    await expect(page.getByText(EMPTY_LIST)).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
  });

  test('deletes all sightings from Me and leaves the Life list empty', async ({ page }) => {
    const watch = watchForProblems(page);
    await startOffline(page);
    await openSpecies(page);
    await saveSighting(page, 'I saw this');
    await saveSighting(page, 'Add another sighting');
    await expect(page.getByText(/^Seen 2 times · last /)).toBeVisible();

    await openTab(page, 'Me');
    await expect(page.getByText('2 sightings saved on this device')).toBeVisible();
    await page.getByRole('button', { name: 'Delete all sightings on this device' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('All sightings deleted')).toBeVisible();

    await openTab(page, 'Life list');
    await expect(page.getByText(EMPTY_LIST)).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
  });
});

test.describe('life list with storage blocked', () => {
  // IndexedDB refusing to open is how some private-browsing modes behave.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      IDBFactory.prototype.open = () => {
        throw new DOMException('blocked for test', 'SecurityError');
      };
    });
  });

  test('falls back to memory with a banner and loses the sighting on reload', async ({ page }) => {
    const watch = watchForProblems(page);

    await openSpecies(page);
    await saveSighting(page, 'I saw this');
    await expect(page.getByText(SEEN_ONCE)).toBeVisible();
    await openTab(page, 'Life list');
    await expect(page.getByText(STORAGE_BLOCKED)).toBeVisible();
    await expect(page.getByText('1 species', { exact: true })).toBeVisible();
    await page.reload();

    await expect(page.getByText(STORAGE_BLOCKED)).toBeVisible();
    await expect(page.getByText(EMPTY_LIST)).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
  });

  // The banner lives in the tab layout, which the species page covers, so a user saving there is
  // never told the sighting will be lost. App bug, reported with this PR; not fixed here.
  test.fixme('shows the storage banner on the species page too', async ({ page }) => {
    await openSpecies(page);
    await expect(page.getByText(STORAGE_BLOCKED)).toBeVisible();
  });
});
