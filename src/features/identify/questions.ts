import type { SpeciesTraits } from '@/shared/data/traits';
import {
  BEHAVIOURS,
  COLOURS,
  HABITATS,
  SIZE_CLASSES,
  ZONES,
} from '@/shared/data/traits-vocabulary';

import { compact } from './answers-params';
import { isMatch, rank } from './rank';
import type { Answers } from './types';

export const STEPS = ['zone', 'habitat', 'size', 'colour', 'behaviour'] as const;
export type Step = (typeof STEPS)[number];

// labelKey is a literal type so a missing en/si key fails the type-check.
export const STEP_OPTIONS = {
  zone: ZONES.map((value) => ({ value, labelKey: `identify.zone.${value}` as const })),
  habitat: HABITATS.map((value) => ({ value, labelKey: `identify.habitat.${value}` as const })),
  size: SIZE_CLASSES.map((value) => ({ value, labelKey: `identify.size.${value}` as const })),
  colour: COLOURS.map((value) => ({ value, labelKey: `identify.colour.${value}` as const })),
  behaviour: BEHAVIOURS.map((value) => ({
    value,
    labelKey: `identify.behaviour.${value}` as const,
  })),
};

// The question is "colour" but the answer holds up to three, so it is stored as "colours".
export const ANSWER_KEY = {
  zone: 'zone',
  habitat: 'habitat',
  size: 'size',
  colour: 'colours',
  behaviour: 'behaviour',
} as const;

export function isStep(value: string | undefined): value is Step {
  return STEPS.some((step) => step === value);
}

/** The step before or after `step`; undefined past either end. */
export function neighbour(step: Step, offset: -1 | 1): Step | undefined {
  return STEPS[STEPS.indexOf(step) + offset];
}

// `value` comes from STEP_OPTIONS[step]; undefined is "Not sure" and clears the answer.
export function withAnswer(answers: Answers, step: Step, value: string | undefined): Answers {
  const answer = step === 'colour' && value ? [value] : value;
  return compact({ ...answers, [ANSWER_KEY[step]]: answer });
}

/** The one chosen option of a question; for colour, the first colour. */
export function chosenValue(answers: Answers, step: Step): string | undefined {
  return step === 'colour' ? answers.colours?.[0] : answers[step];
}

export function countMatches(traits: SpeciesTraits[], answers: Answers): number {
  return rank(traits, answers).filter(isMatch).length;
}

// One static page per question (ADR 0001).
export function questionStaticParams(): { step: string }[] {
  return STEPS.map((step) => ({ step }));
}
