import type {
  Behaviour,
  Colour,
  Commonness,
  Habitat,
  Month,
  MonthPresence,
  SizeClass,
  Zone,
} from './vocabulary';

// Every field is optional: a skipped question is simply missing.
export type Answers = {
  month?: Month;
  zone?: Zone;
  habitat?: Habitat;
  size?: SizeClass;
  colours?: Colour[]; // at most 3
  behaviour?: Behaviour;
};

// undefined means "no reviewed value". An empty array means "reviewed: none".
export type SpeciesTraits = {
  species_id: string;
  zones?: Zone[];
  habitats?: Habitat[];
  size?: SizeClass[]; // can span classes
  colours?: Colour[][]; // one list per plumage
  behaviours?: Behaviour[];
  months?: MonthPresence[]; // 12 entries, January first
  commonness?: Partial<Record<Zone, Commonness>>;
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
