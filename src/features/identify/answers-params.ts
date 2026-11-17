import {
  BEHAVIOURS,
  COLOURS,
  HABITATS,
  MAX_COLOURS,
  MONTHS,
  SIZE_CLASSES,
  ZONES,
} from '@/shared/data/traits-vocabulary';
import type { Colour, Month } from '@/shared/data/traits-vocabulary';

import type { Answers } from './types';

export type RouteParams = Record<string, string | string[] | undefined>;

const ANY_MONTH = 'any';
const COLOUR_SEPARATOR = ',';

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

// "red,blue" becomes ['red', 'blue']. Unknown names and repeats are dropped; the first three chosen are kept.
function parseColours(raw: string | string[] | undefined): Colour[] | undefined {
  const names = new Set(firstValue(raw)?.split(COLOUR_SEPARATOR));
  const colours = [...names].flatMap((name) => COLOURS.filter((colour) => colour === name));
  return colours.length > 0 ? colours.slice(0, MAX_COLOURS) : undefined;
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
    colours: parseColours(params.colours),
    behaviour: pick(BEHAVIOURS, params.behaviour),
  });
}

export function serializeAnswers(answers: Answers): Record<string, string> {
  const params: Record<string, string> = { month: String(answers.month ?? ANY_MONTH) };
  if (answers.zone) params.zone = answers.zone;
  if (answers.habitat) params.habitat = answers.habitat;
  if (answers.size) params.size = answers.size;
  if (answers.colours?.length) params.colours = answers.colours.join(COLOUR_SEPARATOR);
  if (answers.behaviour) params.behaviour = answers.behaviour;
  return params;
}

export const currentMonth = (): Month => MONTHS[new Date().getMonth()] ?? 1;
