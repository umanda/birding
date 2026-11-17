import type { MessageKey, Translate } from '@/shared/i18n/translate';

import { compact } from './answers-params';
import { ANSWER_KEY, STEPS } from './questions';
import type { Step } from './questions';
import { isMatch } from './rank';
import type { Answers, Flag, RankedSpecies, Reason, ReasonField, ReasonFit } from './types';

const CLOSEST_COUNT = 5;
const COLOUR_SEPARATOR = ', ';

const FIELD_KEY: Record<ReasonField, MessageKey> = {
  zone: 'identify.field.zone',
  month: 'identify.field.month',
  habitat: 'identify.field.habitat',
  size: 'identify.field.size',
  colours: 'identify.field.colours',
  behaviour: 'identify.field.behaviour',
};
type ShownFit = Exclude<ReasonFit, 'unknown'>;
const FIT: Record<ShownFit, { glyph: string; key: MessageKey }> = {
  match: { glyph: '✓', key: 'identify.fit.match' },
  partial: { glyph: '≈', key: 'identify.fit.partial' },
  mismatch: { glyph: '✗', key: 'identify.fit.mismatch' },
};
// One shape per kind of flag, so the meaning never rests on colour (UX flows 2.2).
const FLAG: Record<Flag, { glyph: string; key: MessageKey }> = {
  'not-usually-here': { glyph: '⚑', key: 'identify.flag.not-usually-here' },
  'not-usually-now': { glyph: '⚑', key: 'identify.flag.not-usually-now' },
  'data-incomplete': { glyph: 'ⓘ', key: 'identify.flag.data-incomplete' },
};

// glyph is decorative; spoken is the text for screen readers.
export type WhyPart = { label: string; glyph: string; spoken: string };

// Unknown fits are left out: the "Data incomplete" flag already says so.
export function whyParts(reasons: Reason[], t: Translate): WhyPart[] {
  return reasons.flatMap(({ field, fit }) => {
    if (fit === 'unknown') return [];
    const label = t(FIELD_KEY[field]);
    return [{ label, glyph: FIT[fit].glyph, spoken: `${label}: ${t(FIT[fit].key)}` }];
  });
}

export type FlagPart = { glyph: string; label: string };

export const flagParts = (flags: Flag[], t: Translate): FlagPart[] =>
  flags.map((flag) => ({ glyph: FLAG[flag].glyph, label: t(FLAG[flag].key) }));

export type Chip = { field: keyof Answers; label: string };

// In step order, month first, so the last chip is the one "Remove last answer" drops.
export function answerChips(answers: Answers, t: Translate): Chip[] {
  const chips: Chip[] = [];
  if (answers.month)
    chips.push({ field: 'month', label: t(`identify.monthName.${answers.month}`) });
  if (answers.zone) chips.push({ field: 'zone', label: t(`identify.zone.${answers.zone}`) });
  if (answers.habitat) {
    chips.push({ field: 'habitat', label: t(`identify.habitat.${answers.habitat}`) });
  }
  if (answers.size)
    chips.push({ field: 'size', label: t('identify.chip.size', { size: answers.size }) });
  if (answers.colours?.length) {
    const names = answers.colours.map((colour) => t(`identify.colour.${colour}`));
    chips.push({ field: 'colours', label: names.join(COLOUR_SEPARATOR) });
  }
  if (answers.behaviour) {
    chips.push({ field: 'behaviour', label: t(`identify.behaviour.${answers.behaviour}`) });
  }
  return chips;
}

export const withoutAnswer = (answers: Answers, field: keyof Answers): Answers =>
  compact({ ...answers, [field]: undefined });

const isUnanswered = (answers: Answers, step: Step): boolean =>
  answers[ANSWER_KEY[step]] === undefined;

export const firstUnanswered = (answers: Answers): Step | undefined =>
  STEPS.find((step) => isUnanswered(answers, step));

export const unansweredCount = (answers: Answers): number =>
  STEPS.filter((step) => isUnanswered(answers, step)).length;

export type ResultsView = { matches: RankedSpecies[]; closest: RankedSpecies[] };

// The closest non-matches only appear when there is nothing better to show.
export function resultsView(ranked: RankedSpecies[]): ResultsView {
  const matches = ranked.filter(isMatch);
  if (matches.length > 0) return { matches, closest: [] };
  return { matches, closest: ranked.slice(0, CLOSEST_COUNT) };
}
