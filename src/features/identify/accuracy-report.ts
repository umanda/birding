import { rank } from './rank';
import type { TestSighting } from './sightings-csv';
import type { SpeciesTraits } from '@/shared/data/traits';

export const TOP_N = 5;
export const WIDE_N = 10;
export const GROUP_TOP_N = 3;
// The spec says "about"; these are the floors the scenario mix has to reach.
export const MIN_COMMON_SHARE = 0.6;
export const MIN_INDEPENDENT_SHARE = 0.2;

export type Scored = {
  sighting: TestSighting;
  position: number; // 1-based; 0 when the species is missing from the ranking
  topIds: string[]; // the first GROUP_TOP_N species
  plate: string;
  batch: string;
  common: boolean; // target is common in at least one zone
  scarce: boolean; // target has commonness data and it is scarce everywhere
};
export type Tally = { count: number; top5: number; top10: number };
export type SpeciesContext = { plateOf: Record<string, string>; batchOf: Record<string, string> };

type ScoreInput = {
  sightings: TestSighting[];
  traits: SpeciesTraits[];
  context: SpeciesContext;
  order: Record<string, number>;
};

export function scoreSightings({ sightings, traits, context, order }: ScoreInput): Scored[] {
  const byId = new Map(traits.map((t) => [t.species_id, t]));
  return sightings.map((sighting) => {
    const id = sighting.expected_species_id;
    const ranked = rank(traits, sighting.answers, { order }).map((r) => r.species_id);
    const levels = Object.values(byId.get(id)?.commonness ?? {});
    return {
      sighting,
      position: ranked.indexOf(id) + 1,
      topIds: ranked.slice(0, GROUP_TOP_N),
      plate: context.plateOf[id] ?? 'unknown',
      batch: context.batchOf[id] ?? 'unknown',
      common: levels.includes('common'),
      scarce: levels.length > 0 && levels.every((level) => level === 'scarce'),
    };
  });
}

const share = (part: number, whole: number): number => (whole === 0 ? 0 : part / whole);
const within = (item: Scored, limit: number): boolean =>
  item.position >= 1 && item.position <= limit;

export function tally(items: Scored[]): Tally {
  return {
    count: items.length,
    top5: share(items.filter((i) => within(i, TOP_N)).length, items.length),
    top10: share(items.filter((i) => within(i, WIDE_N)).length, items.length),
  };
}

export function groupBy(items: Scored[], key: (item: Scored) => string): Record<string, Scored[]> {
  const groups: Record<string, Scored[]> = {};
  for (const item of items) (groups[key(item)] ??= []).push(item);
  return groups;
}

export type HardTally = { count: number; top10: number; groupTop3: number };

// Hard: the target is in the top 10, and the target or a lookalike from its group is in the top 3.
export function hardTally(items: Scored[]): HardTally {
  const hard = items.filter((i) => i.sighting.hard_group !== '');
  const members = groupBy(hard, (i) => i.sighting.hard_group);
  const groupIds = (group: string): Set<string> =>
    new Set((members[group] ?? []).map((i) => i.sighting.expected_species_id));
  const inGroupTop3 = hard.filter((i) => {
    const ids = groupIds(i.sighting.hard_group);
    return i.topIds.some((id) => ids.has(id));
  });
  return {
    count: hard.length,
    top10: share(hard.filter((i) => within(i, WIDE_N)).length, hard.length),
    groupTop3: share(inGroupTop3.length, hard.length),
  };
}

export type Mix = { commonShare: number; independentShares: Record<string, number>; met: boolean };

// The headline gates only mean something when the scenarios are not all self-confirming.
export function checkMix(items: Scored[]): Mix {
  const independentShares: Record<string, number> = {};
  for (const [batch, group] of Object.entries(groupBy(items, (i) => i.batch))) {
    const independent = group.filter((i) => i.sighting.scenario_source !== 'drafter');
    independentShares[batch] = share(independent.length, group.length);
  }
  const commonShare = share(items.filter((i) => i.common).length, items.length);
  const met =
    items.length > 0 &&
    commonShare >= MIN_COMMON_SHARE &&
    Object.values(independentShares).every((s) => s >= MIN_INDEPENDENT_SHARE);
  return { commonShare, independentShares, met };
}

const pct = (value: number): string => `${Math.round(value * 100)}%`;
const line = (label: string, t: Tally): string =>
  `  ${label.padEnd(10)} n=${t.count} top5=${pct(t.top5)} top10=${pct(t.top10)}`;

export function formatReport(items: Scored[], mix: Mix): string {
  const rows = [`ID accuracy (${items.length} sightings)`, line('overall', tally(items))];
  const sections: [string, (i: Scored) => string][] = [
    ['plate', (i) => i.plate],
    ['batch', (i) => i.batch],
  ];
  for (const [name, key] of sections) {
    for (const [value, group] of Object.entries(groupBy(items, key))) {
      rows.push(line(`${name} ${value}`, tally(group)));
    }
  }
  const hard = hardTally(items);
  rows.push(line('easy', tally(items.filter((i) => i.sighting.hard_group === ''))));
  rows.push(
    `  hard       n=${hard.count} top10=${pct(hard.top10)} group-in-top3=${pct(hard.groupTop3)}`,
  );
  rows.push(line('scarce', tally(items.filter((i) => i.scarce))) + ' (reported, not gated)');
  rows.push(
    `  mix        common=${pct(mix.commonShare)} met=${mix.met} (headline gate ${mix.met ? 'on' : 'off'})`,
  );
  return rows.join('\n');
}
