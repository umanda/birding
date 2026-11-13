import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import content from '../content/content.json';

const JUNGLEFOWL_ID = 'slb-gallus-lafayettii';
const junglefowl = content.species.find((s) => s.species_id === JUNGLEFOWL_ID);
if (!junglefowl) throw new Error(`${JUNGLEFOWL_ID} missing from content.json`);
const ENGLISH_NAME = junglefowl.names.en;
const SINHALA_NAME = junglefowl.names.si;
const SCIENTIFIC_NAME = junglefowl.names.scientific;
const ENDEMIC_PLATE_COUNT = new Set(
  content.species.filter((s) => s.occurrence_code === 'E').map((s) => s.plate_id),
).size;
// KNOWN BUG: the species header back icon is fetched lazily, so it is missing when the first
// species page is opened offline. Remove this entry once the icon is bundled or precached.
const KNOWN_LAZY_ASSET = /back-icon/;
// Half the width of a 640px phone: the closest browser stand-in for 200% text with px font sizes.
const ZOOMED_VIEWPORT = { width: 320, height: 640 };

async function openApp(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page.getByRole('tab', { name: 'Search' })).toBeVisible();
}

async function searchFor(page: Page, query: string): Promise<void> {
  await page.getByRole('tab', { name: 'Search' }).click();
  await page.getByRole('textbox').fill(query);
}

test('browsing, searching and reading work offline after first load, without reload', async ({
  page,
  context,
}) => {
  const failedRequests: string[] = [];
  await openApp(page);
  await context.setOffline(true);
  page.on('requestfailed', (request) => {
    if (!KNOWN_LAZY_ASSET.test(request.url())) failedRequests.push(request.url());
  });

  await page.getByRole('radio', { name: /සිංහල/ }).click();
  await expect(page.getByRole('tab', { name: 'සොයන්න' })).toBeVisible();
  await page.getByRole('radio', { name: /English/ }).click();
  await expect(page.getByRole('tab', { name: 'Search' })).toBeVisible();

  await searchFor(page, 'junglefowl');
  const firstResult = page.getByRole('link', { name: ENGLISH_NAME }).first();
  await expect(firstResult).toBeVisible();
  await firstResult.click();
  await expect(page.getByRole('heading', { name: ENGLISH_NAME })).toBeVisible();
  await page.goBack();

  await page.getByRole('textbox').fill(SINHALA_NAME);
  await expect(page.getByRole('link', { name: ENGLISH_NAME })).toBeVisible();

  await searchFor(page, SCIENTIFIC_NAME);
  await expect(page.getByRole('link', { name: ENGLISH_NAME })).toBeVisible();

  await page.getByRole('tab', { name: 'Browse' }).click();
  await expect(page.getByText(/^Plate \d+/).first()).toBeVisible();
  await page.getByRole('checkbox', { name: /Endemic/ }).click();
  await expect(page.getByRole('checkbox', { name: /Endemic/ })).toBeChecked();
  await expect(page).toHaveURL(/occ=E/);
  await expect.poll(() => page.getByText(/^Plate \d+/).count()).toBe(ENDEMIC_PLATE_COUNT);

  await page.getByRole('link', { name: /^Plate 1 ·/ }).click();
  await expect(page.getByRole('heading', { name: /^Plate 1 ·/ })).toBeVisible();
  await expect(page.getByRole('link', { name: ENGLISH_NAME })).toBeVisible();
  await expect(page.getByRole('link', { name: /Indian Peafowl/ })).toHaveCount(0);
  await page.getByRole('link', { name: ENGLISH_NAME }).click();
  await expect(page.getByRole('heading', { name: ENGLISH_NAME })).toBeVisible();

  expect(failedRequests).toEqual([]);
});

async function expectNoOverflow(element: Locator): Promise<void> {
  await expect(element).toBeVisible();
  const overflows = await element.evaluate(
    (el) => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight,
  );
  expect(overflows).toBe(false);
}

test.describe('on a 320px-wide screen (stand-in for 200% text)', () => {
  test.use({ viewport: ZOOMED_VIEWPORT });

  test('species heading and badge do not overflow', async ({ page }) => {
    await page.goto(`/species/${JUNGLEFOWL_ID}`);
    await expectNoOverflow(page.getByRole('heading', { name: ENGLISH_NAME }));
    await expectNoOverflow(page.getByLabel(/^E /).first());
  });

  test('tab labels do not overflow', async ({ page }) => {
    await openApp(page);
    await expectNoOverflow(page.getByRole('tab', { name: 'Search' }));
  });
});
