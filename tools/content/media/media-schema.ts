import { z } from 'zod';

export const VIEWS = ['perched', 'flight'] as const;
export const TRAINING_OK = ['yes', 'no', 'unknown'] as const;
export const STATUSES = ['proposed', 'reviewed', 'rejected'] as const;

// male|female|juvenile|adult|breeding|non_breeding|eclipse|morph_<name>
export const PLUMAGE_KEY = /^(male|female|juvenile|adult|breeding|non_breeding|eclipse|morph_[a-z0-9_]+)$/;

const required = z.string().min(1);
// Blank cells stay null; they are never filled in.
const optional = required.nullable();
const httpsUrl = z.url({ protocol: /^https$/ });

export const MediaRowSchema = z.object({
  image_id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  species_id: required,
  plumage_key: z.string().regex(PLUMAGE_KEY),
  view: z.enum(VIEWS),
  file: required,
  source_url: httpsUrl.nullable(),
  author: optional,
  licence: optional,
  licence_url: httpsUrl.nullable(),
  attribution: optional,
  modifications: optional,
  retrieved_on: z.iso.date().nullable(),
  display_ok: z.enum(['yes', 'no']).nullable(),
  training_ok: z.enum(TRAINING_OK),
  status: z.enum(STATUSES),
  reviewed_by: optional,
  reviewed_at: z.iso.date().nullable(),
});

export const REGISTER_COLUMNS = Object.keys(MediaRowSchema.shape);

export type MediaRow = z.infer<typeof MediaRowSchema>;
