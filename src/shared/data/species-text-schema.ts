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

// Workbook Conservation columns, copied verbatim (blank is null). The two codes also live in
// content.json; the "previous_*" columns are kept as the workbook has them, not interpreted.
const NullableText = z.string().min(1).nullable();
export const CONSERVATION_FIELDS = [
  'occurrence_verification_status',
  'occurrence_source_note',
  'iucn_assessment_year',
  'iucn_verification_status',
  'iucn_source_note',
  'birdlife_factsheet_url',
  'previous_occurrence_code',
  'previous_iucn_category',
  'avilist_iucn_category',
] as const;

const ConservationSchema = z.strictObject({
  occurrence_verification_status: NullableText,
  occurrence_source_note: NullableText,
  iucn_assessment_year: NullableText,
  iucn_verification_status: NullableText,
  iucn_source_note: NullableText,
  birdlife_factsheet_url: NullableText,
  previous_occurrence_code: NullableText,
  previous_iucn_category: NullableText,
  avilist_iucn_category: NullableText,
});

// The workbook has no title column. `citation` is the Species Sources cell verbatim (a bare link or
// free text). `links` are the http(s) URLs found in it, in order; empty when the cell has none.
const SourceSchema = z.strictObject({
  source_id: z.string().min(1),
  citation: z.string().min(1),
  links: z.array(z.string().min(1)),
  type: z.string().min(1).nullable(),
  verification_note: z.string().min(1).nullable(),
});

const SpeciesRecordSchema = SpeciesFieldsSchema.extend({
  conservation: ConservationSchema,
  sources: z.array(SourceSchema),
});

// schema_version 3 belongs to this file; content.json stays at 1.
export const SpeciesTextFileSchema = z.strictObject({
  schema_version: z.literal(3),
  species: z.record(z.string().min(1), SpeciesRecordSchema),
});

export type TextValue = z.infer<typeof TextValueSchema>;
export type Conservation = z.infer<typeof ConservationSchema>;
export type SpeciesSource = z.infer<typeof SourceSchema>;
export type SpeciesTextFile = z.infer<typeof SpeciesTextFileSchema>;
export type TextLang = NonNullable<TextValue>['lang'];
