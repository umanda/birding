import { rank } from './rank';
import type { TestSighting } from './sightings-csv';
import type { SpeciesTraits } from '@/shared/data/traits';

export const TOP_N = 5;
export const WIDE_N = 10;
export const GROUP_TOP_N = 3;
// The spec says "about"; these are the floors the scenario mix has to reach.
export const MIN_COMMON_SHARE = 0.6;
export const MIN_INDEPENDENT_SHARE = 0.2;
export const MIN_TOP5 = 0.7;
export const MIN_TOP10 = 0.9;
export const MIN_EASY_TOP5 = 0.8;
export const MIN_HARD_TOP10 = 0.8;
export const MIN_HARD_GROUP_TOP3 = 0.9;

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

// Group members are the targets of the hard sightings, so each lookalike needs a sighting of its own.
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

export type BatchMix = {
  batch: string;
  count: number;
  commonShare: number;
  independentShare: number;
  met: boolean;
};

// The M5 pilot was drafted and tested by one person; it is reported but not held to the mix.
export const LEGACY_BATCH = '0';

// Each batch is gated on its own, so each needs its own mix of scenarios (spec 006).
export function batchMixes(items: Scored[]): BatchMix[] {
  return Object.entries(groupBy(items, (i) => i.batch)).map(([batch, group]) => {
    const commonShare = share(group.filter((i) => i.common).length, group.length);
    const independentShare = share(
      group.filter((i) => i.sighting.scenario_source !== 'drafter').length,
      group.length,
    );
    const met = commonShare >= MIN_COMMON_SHARE && independentShare >= MIN_INDEPENDENT_SHARE;
    return { batch, count: group.length, commonShare, independentShare, met };
  });
}

// Scarce targets are reported, not gated. Vagrant is not modelled: the data has no field for it.
const gated = (items: Scored[]): Scored[] => items.filter((i) => !i.scarce);

// One message per failed gate; an empty list means every applicable gate passed.
export function headlineProblems(items: Scored[], mixes: BatchMix[]): string[] {
  const problems: string[] = [];
  for (const mix of mixes.filter((m) => m.batch !== LEGACY_BATCH)) {
    if (!mix.met) {
      problems.push(
        `batch ${mix.batch}: scenario mix not met (non-drafter ${pct(mix.independentShare)}, need ${pct(MIN_INDEPENDENT_SHARE)}; common targets ${pct(mix.commonShare)}, need ${pct(MIN_COMMON_SHARE)})`,
      );
      continue;
    }
    const result = tally(gated(items.filter((i) => i.batch === mix.batch)));
    if (result.top5 < MIN_TOP5)
      problems.push(`batch ${mix.batch}: top-5 ${pct(result.top5)} < ${pct(MIN_TOP5)}`);
    if (result.top10 < MIN_TOP10)
      problems.push(`batch ${mix.batch}: top-10 ${pct(result.top10)} < ${pct(MIN_TOP10)}`);
  }
  return problems;
}

export function easyProblems(items: Scored[]): string[] {
  const easy = tally(gated(items.filter((i) => i.sighting.hard_group === '')));
  return easy.count > 0 && easy.top5 < MIN_EASY_TOP5
    ? [`easy top-5 ${pct(easy.top5)} < ${pct(MIN_EASY_TOP5)}`]
    : [];
}

// With no hard scenarios there is nothing to gate; the report prints "not gated".
export function hardProblems(items: Scored[]): string[] {
  const hard = hardTally(gated(items));
  if (hard.count === 0) return [];
  const problems: string[] = [];
  if (hard.top10 < MIN_HARD_TOP10)
    problems.push(`hard top-10 ${pct(hard.top10)} < ${pct(MIN_HARD_TOP10)}`);
  if (hard.groupTop3 < MIN_HARD_GROUP_TOP3)
    problems.push(`hard group-in-top-3 ${pct(hard.groupTop3)} < ${pct(MIN_HARD_GROUP_TOP3)}`);
  return problems;
}

const pct = (value: number): string => `${Math.round(value * 100)}%`;
const line = (label: string, t: Tally): string =>
  `  ${label.padEnd(10)} n=${t.count} top5=${pct(t.top5)} top10=${pct(t.top10)}`;

export function formatReport(items: Scored[], mixes: BatchMix[]): string {
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
    hard.count === 0
      ? '  hard       n=0 (not gated)'
      : `  hard       n=${hard.count} top10=${pct(hard.top10)} group-in-top3=${pct(hard.groupTop3)}`,
  );
  rows.push(line('scarce', tally(items.filter((i) => i.scarce))) + ' (reported, not gated)');
  for (const m of mixes) {
    const gate = m.batch === LEGACY_BATCH ? 'legacy, not gated' : m.met ? 'gated' : 'MIX NOT MET';
    rows.push(
      `  mix batch ${m.batch}: common=${pct(m.commonShare)} non-drafter=${pct(m.independentShare)} (${gate})`,
    );
  }
  return rows.join('\n');
}
