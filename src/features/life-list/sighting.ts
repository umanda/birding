import { ZONES, type Zone } from '@/shared/data/traits-vocabulary';

export const PLACE_NAME_MAX = 80;
export const NOTE_MAX = 500;
export const COUNT_MIN = 1;
export const COUNT_MAX = 999;

// Dates and timestamps are strings so the same shape works in IndexedDB, SQLite and (later) sync.
export type Sighting = {
  id: string;
  species_id: string;
  seen_on: string; // local date, YYYY-MM-DD
  place_name: string | null;
  zone: Zone | null;
  count: number | null;
  note: string | null;
  lat_rounded: null; // always null in M6, kept for ADR 0006
  lon_rounded: null;
  content_version: string;
  created_at: string; // ISO UTC
  updated_at: string;
  deleted_at: string | null;
  synced_at: string | null;
};

// What the user can edit. Blank (undefined, null or '') is stored as null.
export type SightingFields = {
  seen_on: string;
  place_name?: string | null;
  zone?: Zone | null;
  count?: number | null;
  note?: string | null;
};
export type SightingInput = SightingFields & { species_id: string; content_version: string };
export type CleanFields = Required<SightingFields>;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/;

const isFilled = (v: unknown): v is string => typeof v === 'string' && v !== '';
const isNullOr = (v: unknown, check: (x: unknown) => boolean): boolean => v === null || check(v);
const isShortText = (max: number) => (v: unknown) => typeof v === 'string' && v.length <= max;
const isCount = (v: unknown): boolean =>
  Number.isInteger(v) && (v as number) >= COUNT_MIN && (v as number) <= COUNT_MAX;
const isZone = (v: unknown): boolean => ZONES.some((zone) => zone === v);
const isIsoTime = (v: unknown): boolean => typeof v === 'string' && ISO_PATTERN.test(v);

export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

export function toLocalDate(now: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Storage boundary: stored rows are untrusted, so check every field before use.
export function isSighting(value: unknown): value is Sighting {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    isFilled(row.id) &&
    isFilled(row.species_id) &&
    isCalendarDate(row.seen_on) &&
    isNullOr(row.place_name, isShortText(PLACE_NAME_MAX)) &&
    isNullOr(row.zone, isZone) &&
    isNullOr(row.count, isCount) &&
    isNullOr(row.note, isShortText(NOTE_MAX)) &&
    row.lat_rounded === null &&
    row.lon_rounded === null &&
    isFilled(row.content_version) &&
    isIsoTime(row.created_at) &&
    isIsoTime(row.updated_at) &&
    isNullOr(row.deleted_at, isIsoTime) &&
    isNullOr(row.synced_at, isIsoTime)
  );
}

const blankToNull = <T>(value: T | null | undefined): T | null =>
  value === undefined || (value as unknown) === '' ? null : value;

export function cleanFields(fields: SightingFields): CleanFields {
  return {
    seen_on: fields.seen_on,
    place_name: blankToNull(fields.place_name),
    zone: blankToNull(fields.zone),
    count: blankToNull(fields.count),
    note: blankToNull(fields.note),
  };
}

// Returns the first problem as a message, or null when the fields are valid.
export function findFieldsError(fields: CleanFields, today: string): string | null {
  if (!isCalendarDate(fields.seen_on)) return 'seen_on must be a YYYY-MM-DD date';
  if (fields.seen_on > today) return 'seen_on cannot be in the future';
  if (!isNullOr(fields.place_name, isShortText(PLACE_NAME_MAX))) return 'place_name is too long';
  if (!isNullOr(fields.zone, isZone)) return 'zone is not a known zone';
  if (!isNullOr(fields.count, isCount)) {
    return `count must be a whole number ${COUNT_MIN}-${COUNT_MAX}`;
  }
  if (!isNullOr(fields.note, isShortText(NOTE_MAX))) return 'note is too long';
  return null;
}
