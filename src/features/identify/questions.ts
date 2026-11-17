import type { SpeciesTraits } from '@/shared/data/traits';
import { HABITATS, SIZE_CLASSES, ZONES } from '@/shared/data/traits-vocabulary';

import { compact } from './answers-params';
import { isMatch, rank } from './rank';
import type { Answers } from './types';

export const STEPS = ['zone', 'habitat', 'size'] as const;
export type Step = (typeof STEPS)[number];

export const STEP_OPTIONS: Record<Step, readonly string[]> = {
  zone: ZONES,
  habitat: HABITATS,
  size: SIZE_CLASSES,
};

export function isStep(value: string | undefined): value is Step {
  return STEPS.some((step) => step === value);
}

/** The step before or after `step`; undefined past either end. */
export function neighbour(step: Step, offset: -1 | 1): Step | undefined {
  return STEPS[STEPS.indexOf(step) + offset];
}

// `value` comes from STEP_OPTIONS[step]; undefined is "Not sure" and clears the answer.
export function withAnswer(answers: Answers, step: Step, value: string | undefined): Answers {
  return compact({ ...answers, [step]: value });
}

export function countMatches(traits: SpeciesTraits[], answers: Answers): number {
  return rank(traits, answers).filter(isMatch).length;
}

// One static page per question (ADR 0001).
export function questionStaticParams(): { step: string }[] {
  return STEPS.map((step) => ({ step }));
}
