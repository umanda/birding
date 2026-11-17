// Vocabularies from docs/product/02-identification-design.md sections 1 and 3.
// Kept in one file so the content validator can reuse them.

export const ZONES = [
  'wet_lowland',
  'wet_midhill',
  'montane',
  'intermediate',
  'dry_lowland',
  'arid_coast_north',
] as const;
export type Zone = (typeof ZONES)[number];

export const HABITATS = ['town_garden', 'forest', 'open_country', 'freshwater', 'coast'] as const;
export type Habitat = (typeof HABITATS)[number];

// Ordered smallest to largest: the index gap is the number of classes apart.
export const SIZE_CLASSES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
export type SizeClass = (typeof SIZE_CLASSES)[number];

// The palette's "rufous/chestnut" and "purple/glossy" are shortened to one word.
export const COLOURS = [
  'black',
  'white',
  'grey',
  'brown',
  'rufous',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'red',
  'pink',
] as const;
export type Colour = (typeof COLOURS)[number];

// These are the `where_seen` values.
export const BEHAVIOURS = [
  'ground',
  'swimming',
  'wading',
  'tree_bush',
  'perched_open',
  'aerial',
] as const;
export type Behaviour = (typeof BEHAVIOURS)[number];

export const MONTH_PRESENCE = ['present', 'peak', 'scarce', 'absent', 'unknown'] as const;
export type MonthPresence = (typeof MONTH_PRESENCE)[number];

export const COMMONNESS = ['common', 'uncommon', 'scarce'] as const;
export type Commonness = (typeof COMMONNESS)[number];

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
