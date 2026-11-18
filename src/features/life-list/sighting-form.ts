import type { MessageKey } from '@/shared/i18n/translate';

import { cleanFields, findFieldsErrorId, toLocalDate } from './sighting';
import type { CleanFields, FieldId, Sighting } from './sighting';

// What the inputs hold: text for every field, so half-typed values can be shown and validated.
export type FormValues = Pick<Sighting, 'seen_on' | 'zone'> & {
  place: string;
  count: string;
  note: string;
};

export const emptyValues = (today: string): FormValues => ({
  seen_on: today,
  zone: null,
  place: '',
  count: '',
  note: '',
});

export const valuesFromSighting = (s: Sighting): FormValues => ({
  seen_on: s.seen_on,
  zone: s.zone,
  place: s.place_name ?? '',
  count: s.count === null ? '' : String(s.count),
  note: s.note ?? '',
});

// Anything that is not plain digits becomes NaN so the validator rejects it.
export const parseCount = (text: string): number | null => {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  return /^\d+$/.test(trimmed) ? Number(trimmed) : Number.NaN;
};

export const toCleanFields = (v: FormValues): CleanFields =>
  cleanFields({
    // Trimmed because a stray space from a keyboard or paste would fail the strict date pattern.
    seen_on: v.seen_on.trim(),
    place_name: v.place,
    zone: v.zone,
    count: parseCount(v.count),
    note: v.note,
  });

const ERROR_KEYS: Record<FieldId, MessageKey> = {
  seen_on: 'sighting.error.date',
  place_name: 'sighting.error.place',
  zone: 'sighting.error.zone',
  count: 'sighting.error.count',
  note: 'sighting.error.note',
};

/** The failing field and its message key, or null when the values can be saved. */
export function findFormError(
  values: FormValues,
  today: string,
): { field: FieldId; key: MessageKey } | null {
  const field = findFieldsErrorId(toCleanFields(values), today);
  return field === null ? null : { field, key: ERROR_KEYS[field] };
}

export function dayBefore(date: string): string {
  const [y = 0, m = 1, d = 1] = date.split('-').map(Number);
  return toLocalDate(new Date(y, m - 1, d - 1));
}
