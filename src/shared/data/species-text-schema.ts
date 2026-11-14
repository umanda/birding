import { z } from 'zod';

// Build-time schema (tools and tests). Client code uses `import type` only, so zod stays out of the bundle.
export const TEXT_FIELDS = [
  'species_description',
  'male_female_identification',
  'juvenile_immature_plumage',
  'field_spotting_tips',
  'sri_lanka_distribution_and_hotspots',
  'seasonality_months_seen',
] as const;

export type TextField = (typeof TEXT_FIELDS)[number];

const TextValueSchema = z
  .strictObject({ text: z.string().min(1), lang: z.enum(['si', 'en']) })
  .nullable();

// Fields are written out so a misspelled or extra field fails validation.
const SpeciesFieldsSchema = z.strictObject({
  species_description: TextValueSchema,
  male_female_identification: TextValueSchema,
  juvenile_immature_plumage: TextValueSchema,
  field_spotting_tips: TextValueSchema,
  sri_lanka_distribution_and_hotspots: TextValueSchema,
  seasonality_months_seen: TextValueSchema,
});

// schema_version 2 belongs to this file; content.json stays at 1.
export const SpeciesTextFileSchema = z.strictObject({
  schema_version: z.literal(2),
  species: z.record(z.string().min(1), SpeciesFieldsSchema),
});

export type TextValue = z.infer<typeof TextValueSchema>;
export type SpeciesTextFile = z.infer<typeof SpeciesTextFileSchema>;
export type TextLang = NonNullable<TextValue>['lang'];
