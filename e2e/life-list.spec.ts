import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import content from '../content/content.json';
import { isUnexpectedOfflineFailure, waitForServiceWorkerControl } from './service-worker';

type Bird = { species_id: string; names: { en: string } };

const ENDEMIC_ID = 'slb-gallus-lafayettii'; // Sri Lanka Junglefowl, plate 1
const endemic = content.species.find((s) => s.species_id === ENDEMIC_ID);
const otherEndemic = content.species.find(
  (s) => s.occurrence_code === 'E' && s.species_id !== ENDEMIC_ID,
);
const resident = content.species.find((s) => s.occurrence_code === 'R');
if (!endemic || !otherEndemic || !resident) {
  throw new Error('content.json lacks the Junglefowl, a second endemic or a resident');
}
const ENDEMIC_TOTAL = content.species.filter((s) => s.occurrence_code === 'E').length;

const PLACE = 'Sinharaja';
const ZONE = /^Wet lowlands/;
const SAVED = 'Saved on this device';
const SEEN_ONCE = /^Seen 1 time · last /;
const EMPTY_LIST = 'Your list is empty. Find a bird to add.';
const STORAGE_BLOCKED = "Sightings can't be saved on this device right now.";

// React recovers from a hydration mismatch by re-rendering, and offline-reload.spec.ts already
// treats it as expected on the species template. Allowed on /species/* only, so it cannot hide
// the error on other pages. Remove this allowance when #98 is fixed.
const HYDRATION_ERROR = /Minified React error #418/;
const SPECIES_PATH = /^\/species\/[^/]+$/;

type Watch = { pageErrors: string[]; failedRequests: string[] };

// Collects problems from every page the test visits; call before the first navigation.
function watchForProblems(page: Page): Watch {
  const watch: Watch = { pageErrors: [], failedRequests: [] };
  page.on('pageerror', (error) => {
    const allowed = SPECIES_PATH.test(new URL(page.url()).pathname);
    if (allowed && HYDRATION_ERROR.test(error.message)) return;
    watch.pageErrors.push(`${page.url()}: ${error.message}`);
  });
  page.on('requestfailed', (request) => {
    if (isUnexpectedOfflineFailure(request.url())) watch.failedRequests.push(request.url());
  });
  return watch;
}

async function openSpecies(page: Page, bird: Bird = endemic as Bird): Promise<void> {
  await page.goto(`/species/${bird.species_id}`);
  await expect(page.getByRole('heading', { name: bird.names.en })).toBeVisible();
}

// The species page sits above the tab bar; go back client-side (no reload) to reach the tabs.
async function leaveSpecies(page: Page): Promise<void> {
  await page.getByRole('link', { name: /back$/ }).click();
}

async function openTab(page: Page, name: string): Promise<void> {
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
  test('keeps 3 offline sightings (2 endemics) after a reload', async ({ page }) => {
    const watch = watchForProblems(page);
    await startOffline(page);

    await openSpecies(page);
    await saveSighting(page, 'I saw this', true);
    await expect(page.getByText(SEEN_ONCE)).toBeVisible();
    await openSpecies(page, otherEndemic);
    await saveSighting(page, 'I saw this');
    await openSpecies(page, resident);
    await saveSighting(page, 'I saw this');
    await page.reload();

    await expect(page.getByText(SEEN_ONCE)).toBeVisible();
    await leaveSpecies(page);
    await openTab(page, 'Life list');
    await expect(page.getByText('3 species', { exact: true })).toBeVisible();
    await expect(page.getByText(`Endemics 2 of ${ENDEMIC_TOTAL}`)).toBeVisible();
    for (const bird of [endemic, otherEndemic, resident]) {
      await expect(page.getByRole('link', { name: new RegExp(bird.names.en) })).toBeVisible();
    }
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
    await leaveSpecies(page);
    await openTab(page, 'Life list');
    await expect(
      page.getByText('First 5 March 2026 · Last 5 March 2026 · 1 sighting'),
    ).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
    expect(watch.failedRequests).toEqual([]);
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
    await leaveSpecies(page);
    await openTab(page, 'Life list');
    await expect(page.getByText(EMPTY_LIST)).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
    expect(watch.failedRequests).toEqual([]);
  });

  test('deletes all sightings from Me and leaves the Life list empty', async ({ page }) => {
    const watch = watchForProblems(page);
    await startOffline(page);
    await openSpecies(page);
    await saveSighting(page, 'I saw this');
    await saveSighting(page, 'Add another sighting');
    await expect(page.getByText(/^Seen 2 times · last /)).toBeVisible();

    await leaveSpecies(page);
    await openTab(page, 'Me');
    await expect(page.getByText('2 sightings saved on this device')).toBeVisible();
    await page.getByRole('button', { name: 'Delete all sightings on this device' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('All sightings deleted')).toBeVisible();

    await openTab(page, 'Life list');
    await expect(page.getByText(EMPTY_LIST)).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
    expect(watch.failedRequests).toEqual([]);
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
    await leaveSpecies(page);
    await openTab(page, 'Life list');
    await expect(page.getByText(STORAGE_BLOCKED)).toBeVisible();
    await expect(page.getByText('1 species', { exact: true })).toBeVisible();
    await page.reload();

    await expect(page.getByText(STORAGE_BLOCKED)).toBeVisible();
    await expect(page.getByText(EMPTY_LIST)).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
  });

  // The species page sits above the tabs, so it carries its own banner (#107).
  test('shows the storage banner on the species page too', async ({ page }) => {
    const watch = watchForProblems(page);

    await openSpecies(page);

    // The tab layout's banner stays in the DOM under the stack, so only count the visible one.
    await expect(page.getByText(STORAGE_BLOCKED).filter({ visible: true })).toBeVisible();
    expect(watch.pageErrors).toEqual([]);
  });
});
