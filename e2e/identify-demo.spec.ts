import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import content from '../content/content.json';
import en from '../src/shared/i18n/locales/en.json';
import { isUnexpectedOfflineFailure, waitForServiceWorkerControl } from './service-worker';

type Sighting = {
  month: number;
  zone: string;
  habitat: string;
  size: string;
  colours: string[];
  behaviour: string;
  speciesId: string;
};

const TOP_RESULTS = 3;
// Same documented, recoverable hydration mismatches as offline-reload.spec.ts.
const RECOVERABLE_HYDRATION_ERROR = /Minified React error #(418|423|425)|Hydration failed/;
const labels = en as Record<string, string>;

function label(key: string): string {
  const text = labels[key];
  if (!text) throw new Error(`Missing English label ${key}`);
  return text;
}

function readDemoSightings(): Sighting[] {
  const [, ...rows] = readFileSync('data/content/id-test-sightings.csv', 'utf8')
    .trim()
    .split(/\r?\n/);
  return rows
    .map((row) => row.split(','))
    .filter((cols) => cols[8] === 'yes')
    .map(([, month, zone, habitat, size, colours, behaviour, speciesId]) => ({
      month: Number(month),
      zone: zone ?? '',
      habitat: habitat ?? '',
      size: size ?? '',
      colours: (colours ?? '').split('|'),
      behaviour: behaviour ?? '',
      speciesId: speciesId ?? '',
    }));
}

function englishName(speciesId: string): string {
  const species = content.species.find((s) => s.species_id === speciesId);
  if (!species) throw new Error(`${speciesId} missing from content.json`);
  return species.names.en;
}

async function chooseMonth(page: Page, month: number): Promise<void> {
  await page.getByRole('button', { name: /^Month: / }).click();
  await page
    .getByRole('radio', { name: label(`identify.monthName.${month}`), exact: true })
    .click();
}

async function chooseOption(page: Page, labelKey: string): Promise<void> {
  await page.getByRole('radio', { name: label(labelKey), exact: true }).click();
}

async function chooseColours(page: Page, colours: string[]): Promise<void> {
  for (const colour of colours) {
    await page.getByRole('checkbox', { name: label(`identify.colour.${colour}`) }).click();
  }
  await page.getByRole('button', { name: label('identify.next'), exact: true }).click();
}

async function answerAllQuestions(page: Page, sighting: Sighting): Promise<void> {
  await page.getByRole('button', { name: label('identify.start') }).click();
  await chooseMonth(page, sighting.month);
  await chooseOption(page, `identify.zone.${sighting.zone}`);
  await chooseOption(page, `identify.habitat.${sighting.habitat}`);
  await chooseOption(page, `identify.size.${sighting.size}`);
  await chooseColours(page, sighting.colours);
  await chooseOption(page, `identify.behaviour.${sighting.behaviour}`);
}

test('identifies the five demo birds offline, signed out', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByRole('tab', { name: label('tabs.identify') })).toBeVisible();
  await waitForServiceWorkerControl(page);
  await context.setOffline(true);

  const failedRequests: string[] = [];
  const pageErrors: Error[] = [];
  page.on('pageerror', (error) => {
    if (!RECOVERABLE_HYDRATION_ERROR.test(error.message)) pageErrors.push(error);
  });
  page.on('requestfailed', (request) => {
    if (isUnexpectedOfflineFailure(request.url()))
      failedRequests.push(`${request.url()} ${request.failure()?.errorText}`);
  });

  const sightings = readDemoSightings();
  expect(sightings).toHaveLength(5);

  for (const sighting of sightings) {
    const name = englishName(sighting.speciesId);
    await page.goto('/');
    await page.getByRole('tab', { name: label('tabs.identify') }).click();
    await answerAllQuestions(page, sighting);
    await page.getByRole('button', { name: /^See \d+ match/ }).click();
    await expect(page.getByText(/This guide can identify \d+ of \d+ species so far/)).toBeVisible();
    const resultRows = page.locator('a[href^="/species/"]');
    await expect(resultRows.first()).toBeVisible();
    const topNames = (await resultRows.allTextContents()).slice(0, TOP_RESULTS);
    expect(topNames.join('\n'), `${name} in the top ${TOP_RESULTS}`).toContain(name);

    await page
      .getByRole('link', { name: new RegExp(name) })
      .first()
      .click();
    await expect(page.getByRole('heading', { name })).toBeVisible();
    // The prose chunk loads lazily; wait for it so leaving the page cannot abort the request.
    await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible();
  }

  expect(pageErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
});
