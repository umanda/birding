import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import content from '../content/content.json';
import { waitForServiceWorkerControl } from './service-worker';

const JUNGLEFOWL_ID = 'slb-gallus-lafayettii';
const junglefowl = content.species.find((s) => s.species_id === JUNGLEFOWL_ID);
if (!junglefowl) throw new Error(`${JUNGLEFOWL_ID} missing from content.json`);
const FIRST_PLATE = content.plates[0];
if (!FIRST_PLATE) throw new Error('content.json has no plates');

type RouteCase = { name: string; path: string; expectRendered: (page: Page) => Promise<void> };

const routes: RouteCase[] = [
  {
    name: 'home',
    path: '/',
    expectRendered: (page) => expect(page.getByRole('tab', { name: 'Search' })).toBeVisible(),
  },
  {
    name: 'search',
    path: '/search',
    expectRendered: (page) => expect(page.getByRole('textbox')).toBeVisible(),
  },
  {
    name: 'browse with a filter',
    path: '/browse?occ=E',
    expectRendered: (page) => expect(page.getByRole('checkbox', { name: /Endemic/ })).toBeChecked(),
  },
  {
    name: 'plate',
    path: `/plate/${FIRST_PLATE.plate_id}`,
    expectRendered: (page) =>
      expect(page.getByRole('heading', { name: /^Plate 1 ·/ })).toBeVisible(),
  },
  {
    name: 'species',
    path: `/species/${JUNGLEFOWL_ID}`,
    expectRendered: (page) =>
      expect(page.getByRole('heading', { name: junglefowl.names.en })).toBeVisible(),
  },
];

for (const route of routes) {
  test(`${route.name} reloads offline with no failed request`, async ({ page, context }) => {
    await page.goto(route.path);
    await route.expectRendered(page);
    await waitForServiceWorkerControl(page);
    await context.setOffline(true);

    const failedRequests: string[] = [];
    page.on('requestfailed', (request) => failedRequests.push(request.url()));
    await page.reload();

    await route.expectRendered(page);
    expect(failedRequests).toEqual([]);
  });
}
