import type {
  Behaviour,
  Colour,
  Habitat,
  Month,
  SizeClass,
  Zone,
} from '@/shared/data/traits-vocabulary';

// Every field is optional: a skipped question is simply missing.
export type Answers = {
  month?: Month;
  zone?: Zone;
  habitat?: Habitat;
  size?: SizeClass;
  colours?: Colour[]; // at most MAX_COLOURS
  behaviour?: Behaviour;
};

export type ReasonField = 'zone' | 'month' | 'habitat' | 'size' | 'colours' | 'behaviour';
export type ReasonFit = 'match' | 'partial' | 'mismatch' | 'unknown';
export type Reason = { field: ReasonField; fit: ReasonFit };

export type Flag = 'not-usually-here' | 'not-usually-now' | 'data-incomplete';

export type RankedSpecies = {
  species_id: string;
  score: number;
  reasons: Reason[];
  flags: Flag[];
};
