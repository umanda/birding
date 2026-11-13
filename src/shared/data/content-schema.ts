import { z } from 'zod';

// Codes are copied verbatim from the workbook; never remapped. The Code Lists sheet
// documents E, R, M and R/M only, so R+M and R+(M) are listed here from the data itself.
export const OCCURRENCE_CODES = ['E', 'R', 'M', 'R/M', 'R+M', 'R+(M)'] as const;
export const IUCN_CATEGORIES = ['LC', 'NT', 'VU', 'EN', 'CR', 'DD', 'NE', 'EX'] as const;

export type OccurrenceCode = (typeof OCCURRENCE_CODES)[number];
export type IucnCategory = (typeof IUCN_CATEGORIES)[number];

// Blank workbook cells stay null; they are never replaced by an empty string.
const requiredText = z.string().min(1);
const optionalText = requiredText.nullable();

export const PlateSchema = z.object({
  plate_id: requiredText,
  plate_number: z.number().int().positive(),
  title: z.object({ en: requiredText, si: optionalText }),
});

export const SpeciesSchema = z.object({
  species_id: requiredText,
  plate_id: requiredText,
  plate_order: z.number().int().positive(),
  names: z.object({ en: requiredText, si: optionalText, scientific: requiredText }),
  occurrence_code: z.enum(OCCURRENCE_CODES),
  iucn_category: z.enum(IUCN_CATEGORIES).nullable(),
});

export const ContentSchema = z.object({
  schema_version: z.literal(1),
  source_file: requiredText,
  source_sha256: z.string().regex(/^[0-9a-f]{64}$/),
  plates: z.array(PlateSchema),
  species: z.array(SpeciesSchema),
});

export type Plate = z.infer<typeof PlateSchema>;
export type Species = z.infer<typeof SpeciesSchema>;
export type Content = z.infer<typeof ContentSchema>;
