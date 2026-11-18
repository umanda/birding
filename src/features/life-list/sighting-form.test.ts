import type { Sighting } from './sighting';
import {
  dayBefore,
  emptyValues,
  findFormError,
  parseCount,
  toCleanFields,
  valuesFromSighting,
} from './sighting-form';

const TODAY = '2026-11-18';

describe('parseCount', () => {
  it.each([
    ['', null],
    ['   ', null],
    ['7', 7],
    [' 12 ', 12],
    ['999', 999],
  ])('reads %j as %j', (text, expected) => {
    expect(parseCount(text)).toBe(expected);
  });

  it.each(['1.5', '-3', 'ab', '1e2'])('turns %j into NaN so it is rejected', (text) => {
    expect(parseCount(text)).toBeNaN();
  });
});

describe('findFormError', () => {
  const values = emptyValues(TODAY);

  it('is null for the default values', () => {
    expect(findFormError(values, TODAY)).toBeNull();
  });

  it.each([
    ['seen_on', { seen_on: '2026-11-19' }, 'sighting.error.date'],
    ['seen_on', { seen_on: '2026-1' }, 'sighting.error.date'],
    ['place_name', { place: 'x'.repeat(81) }, 'sighting.error.place'],
    ['count', { count: '0' }, 'sighting.error.count'],
    ['count', { count: '1000' }, 'sighting.error.count'],
    ['note', { note: 'x'.repeat(501) }, 'sighting.error.note'],
  ] as const)('names %s and its message key', (field, over, key) => {
    expect(findFormError({ ...values, ...over }, TODAY)).toEqual({ field, key });
  });

  it('names an unknown zone', () => {
    const bad = { ...values, zone: 'moon' } as unknown as typeof values;
    expect(findFormError(bad, TODAY)).toEqual({ field: 'zone', key: 'sighting.error.zone' });
  });
});

describe('toCleanFields', () => {
  it('trims the date only and blanks empty text', () => {
    const v = { ...emptyValues(TODAY), seen_on: ` ${TODAY} `, place: ' යාල ', note: '  ' };
    expect(toCleanFields(v)).toEqual({
      seen_on: TODAY,
      place_name: ' යාල ',
      zone: null,
      count: null,
      note: null,
    });
  });
});

describe('dayBefore', () => {
  it.each([
    ['2026-11-18', '2026-11-17'],
    ['2026-12-01', '2026-11-30'],
    ['2026-01-01', '2025-12-31'],
    ['2024-03-01', '2024-02-29'],
  ])('%s -> %s', (date, expected) => {
    expect(dayBefore(date)).toBe(expected);
  });
});

describe('valuesFromSighting', () => {
  const saved: Sighting = {
    id: 'a',
    species_id: 's1',
    seen_on: '2026-11-01',
    place_name: null,
    zone: null,
    count: null,
    note: null,
    lat_rounded: null,
    lon_rounded: null,
    content_version: 'v1',
    created_at: '2026-11-01T05:00:00.000Z',
    updated_at: '2026-11-01T05:00:00.000Z',
    deleted_at: null,
    synced_at: null,
  };

  it('turns nulls into empty inputs', () => {
    expect(valuesFromSighting(saved)).toEqual({
      seen_on: '2026-11-01',
      zone: null,
      place: '',
      count: '',
      note: '',
    });
  });

  it('turns stored values into input text', () => {
    const full = {
      ...saved,
      place_name: 'Yala',
      zone: 'dry_lowland',
      count: 4,
      note: 'n',
    } as const;
    expect(valuesFromSighting(full)).toEqual({
      seen_on: '2026-11-01',
      zone: 'dry_lowland',
      place: 'Yala',
      count: '4',
      note: 'n',
    });
  });
});
