import type { Answers, Flag, RankedSpecies, Reason, ReasonField, ReasonFit } from './types';
import type { SpeciesTraits } from '@/shared/data/traits';
import { SIZE_CLASSES } from '@/shared/data/traits-vocabulary';
import type { Colour, Commonness, SizeClass } from '@/shared/data/traits-vocabulary';

// Weights. Place and season outweigh the rest (02 section 2.4).
const ZONE_MATCH = 3; // species lives in the answered zone
const ZONE_MISS = -6; // species is not usually in the answered zone
const MONTH_MATCH = 2; // present in the answered month
const MONTH_MISS = -6; // absent in the answered month
const HABITAT_MATCH = 2; // answered habitat is one of the species' habitats
const HABITAT_MISS = -1; // it is not
const SIZE_SAME = 3; // same size class
const SIZE_ADJACENT = 1.5; // one class away
const SIZE_MISS = -1; // two or more classes away
const COLOUR_MATCH = 2; // per answered colour shown by the best-fitting plumage
const COLOUR_MISS = -0.5; // per answered colour that plumage does not show
const BEHAVIOUR_MATCH = 1.5; // answered behaviour is one the species shows
const BEHAVIOUR_MISS = -0.5; // it is not

type Rule = { fit: ReasonFit; points: number };
export type RankOptions = { order?: Record<string, number> }; // plate order, used as the last tie-break

const UNKNOWN: Rule = { fit: 'unknown', points: 0 };
const COMMONNESS_RANK: Record<Commonness, number> = { common: 0, uncommon: 1, scarce: 2 };
const COMMONNESS_UNKNOWN = 3;

function membership<T>(value: T, known: T[] | undefined, hit: number, miss: number): Rule {
  if (known === undefined) return UNKNOWN;
  return known.includes(value) ? { fit: 'match', points: hit } : { fit: 'mismatch', points: miss };
}

function sizeRule(answer: SizeClass, known: SizeClass[] | undefined): Rule {
  if (known === undefined || known.length === 0) return UNKNOWN;
  const wanted = SIZE_CLASSES.indexOf(answer);
  const gap = Math.min(...known.map((size) => Math.abs(SIZE_CLASSES.indexOf(size) - wanted)));
  if (gap === 0) return { fit: 'match', points: SIZE_SAME };
  if (gap === 1) return { fit: 'partial', points: SIZE_ADJACENT };
  return { fit: 'mismatch', points: SIZE_MISS };
}

function monthRule(month: number, known: SpeciesTraits['months']): Rule {
  const presence = known?.[month - 1];
  if (presence === undefined) return UNKNOWN;
  if (presence === 'absent') return { fit: 'mismatch', points: MONTH_MISS };
  return { fit: 'match', points: MONTH_MATCH };
}

// A single bird shows one plumage at a time, so each plumage is scored alone and the best wins.
function coloursRule(answer: Colour[], known: SpeciesTraits['colours']): Rule {
  if (known === undefined || known.length === 0) return UNKNOWN;
  const wanted = [...new Set(answer)];
  const scored = known.map((plumage) => {
    const found = wanted.filter((colour) => plumage.includes(colour)).length;
    return { found, points: found * COLOUR_MATCH + (wanted.length - found) * COLOUR_MISS };
  });
  const best = scored.reduce((a, b) => (b.points > a.points ? b : a));
  if (best.found === wanted.length) return { fit: 'match', points: best.points };
  return { fit: best.found > 0 ? 'partial' : 'mismatch', points: best.points };
}

// Only answered questions produce a rule; skipped ones add nothing.
function answeredRules(traits: SpeciesTraits, a: Answers): [ReasonField, Rule][] {
  const rules: [ReasonField, Rule][] = [];
  if (a.zone) rules.push(['zone', membership(a.zone, traits.zones, ZONE_MATCH, ZONE_MISS)]);
  if (a.month) rules.push(['month', monthRule(a.month, traits.months)]);
  if (a.habitat) {
    rules.push(['habitat', membership(a.habitat, traits.habitats, HABITAT_MATCH, HABITAT_MISS)]);
  }
  if (a.size) rules.push(['size', sizeRule(a.size, traits.size)]);
  if (a.colours && a.colours.length > 0) {
    rules.push(['colours', coloursRule(a.colours, traits.colours)]);
  }
  if (a.behaviour) {
    const known = traits.behaviours;
    rules.push(['behaviour', membership(a.behaviour, known, BEHAVIOUR_MATCH, BEHAVIOUR_MISS)]);
  }
  return rules;
}

function flagsFor(rules: [ReasonField, Rule][]): Flag[] {
  const flags: Flag[] = [];
  const missed = (field: ReasonField): boolean =>
    rules.some(([name, rule]) => name === field && rule.fit === 'mismatch');
  if (missed('zone')) flags.push('not-usually-here');
  if (missed('month')) flags.push('not-usually-now');
  if (rules.some(([, rule]) => rule.fit === 'unknown')) flags.push('data-incomplete');
  return flags;
}

const DESCRIPTION_FIELDS: ReasonField[] = ['habitat', 'size', 'colours', 'behaviour'];

function sum(rules: [ReasonField, Rule][]): number {
  return rules.reduce((total, [, rule]) => total + rule.points, 0);
}

function scoreSpecies(traits: SpeciesTraits, answers: Answers): RankedSpecies {
  const rules = answeredRules(traits, answers);
  const reasons: Reason[] = rules.map(([field, rule]) => ({ field, fit: rule.fit }));
  const score = sum(rules);
  const descriptionScore = sum(rules.filter(([field]) => DESCRIPTION_FIELDS.includes(field)));
  return {
    species_id: traits.species_id,
    score,
    descriptionScore,
    reasons,
    flags: flagsFor(rules),
  };
}

// Ties go to the species that is commonest in the answered zone.
function commonnessRank(traits: SpeciesTraits, answers: Answers): number {
  const level = answers.zone ? traits.commonness?.[answers.zone] : undefined;
  return level ? COMMONNESS_RANK[level] : COMMONNESS_UNKNOWN;
}

// Plain comparison, not localeCompare, so the order never depends on the device locale.
function compareIds(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function rank(
  traits: SpeciesTraits[],
  answers: Answers,
  options: RankOptions = {},
): RankedSpecies[] {
  const order = options.order ?? {};
  const entries = traits.map((t) => ({
    result: scoreSpecies(t, answers),
    commonness: commonnessRank(t, answers),
    position: order[t.species_id] ?? Number.MAX_SAFE_INTEGER,
  }));
  entries.sort(
    (a, b) =>
      b.result.score - a.result.score ||
      a.commonness - b.commonness ||
      a.position - b.position ||
      compareIds(a.result.species_id, b.result.species_id),
  );
  return entries.map((entry) => entry.result);
}

const MATCH_MIN_DESCRIPTION_SCORE = 0; // below this the description does more harm than good

// What the UI counts as "N matches"; zero of them means "No close matches". Place and season
// act through the flags, so only the description answers are added up here.
export function isMatch(result: RankedSpecies): boolean {
  const unusual = result.flags.some((f) => f === 'not-usually-here' || f === 'not-usually-now');
  return !unusual && result.descriptionScore >= MATCH_MIN_DESCRIPTION_SCORE;
}
