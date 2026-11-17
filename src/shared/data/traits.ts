import type {
  Behaviour,
  Colour,
  Commonness,
  Habitat,
  MonthPresence,
  SizeClass,
  Zone,
} from './traits-vocabulary';

// One species' reviewed traits. undefined means "no reviewed value" (unknown).
// An empty array means "reviewed: none".
export type SpeciesTraits = {
  species_id: string;
  zones?: Zone[];
  habitats?: Habitat[];
  size?: SizeClass[]; // union of the classes of all plumage keys
  colours?: Colour[][]; // one list per plumage; a single bird shows one list at a time
  behaviours?: Behaviour[];
  months?: MonthPresence[]; // exactly 12, January first
  commonness?: Partial<Record<Zone, Commonness>>;
};
