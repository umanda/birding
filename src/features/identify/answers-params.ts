import { HABITATS, SIZE_CLASSES, ZONES } from '@/shared/data/traits-vocabulary';
import type { Month } from '@/shared/data/traits-vocabulary';

import type { Answers } from './types';

export type RouteParams = Record<string, string | string[] | undefined>;

const ANY_MONTH = 'any';
const MONTHS: readonly Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// A repeated param (?zone=a&zone=b) arrives as an array; the first value wins.
function firstValue(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function pick<T extends string>(
  allowed: readonly T[],
  raw: string | string[] | undefined,
): T | undefined {
  const value = firstValue(raw);
  return allowed.find((candidate) => candidate === value);
}

// No month param means "today"; "any" is the explicit choice of no month.
function parseMonth(raw: string | string[] | undefined, today: Month): Month | undefined {
  const value = firstValue(raw);
  if (value === undefined) return today;
  if (value === ANY_MONTH) return undefined;
  return MONTHS.find((month) => String(month) === value) ?? today;
}

type Maybe = { [K in keyof Answers]?: Answers[K] | undefined };

// Drops unset keys; the Answers type forbids explicit undefined.
export function compact(maybe: Maybe): Answers {
  return Object.fromEntries(
    Object.entries(maybe).filter(([, value]) => value !== undefined),
  ) as Answers;
}

export function parseAnswers(params: RouteParams, today: Month): Answers {
  return compact({
    month: parseMonth(params.month, today),
    zone: pick(ZONES, params.zone),
    habitat: pick(HABITATS, params.habitat),
    size: pick(SIZE_CLASSES, params.size),
  });
}

export function serializeAnswers(answers: Answers): Record<string, string> {
  const params: Record<string, string> = { month: String(answers.month ?? ANY_MONTH) };
  if (answers.zone) params.zone = answers.zone;
  if (answers.habitat) params.habitat = answers.habitat;
  if (answers.size) params.size = answers.size;
  return params;
}
