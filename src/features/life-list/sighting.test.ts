import {
  cleanFields,
  findFieldsError,
  isCalendarDate,
  isSighting,
  toLocalDate,
  type CleanFields,
  type Sighting,
} from './sighting';

const valid: Sighting = {
  id: '3f1c0d2e-8a5b-4c7e-9d11-5a2b6c7d8e9f',
  species_id: 'slb-gallus-lafayettii',
  seen_on: '2026-11-10',
  place_name: null,
  zone: null,
  count: null,
  note: null,
  lat_rounded: null,
  lon_rounded: null,
  content_version: 'v1',
  created_at: '2026-11-10T08:00:00.000Z',
  updated_at: '2026-11-10T08:00:00.000Z',
  deleted_at: null,
  synced_at: null,
};

describe('isSighting (shape only)', () => {
  it('accepts a full row', () => {
    expect(isSighting(valid)).toBe(true);
    expect(
      isSighting({ ...valid, zone: 'montane', count: 999, deleted_at: valid.created_at }),
    ).toBe(true);
  });

  it('accepts rows saved under other write rules', () => {
    expect(isSighting({ ...valid, count: 5000, zone: 'new_zone', note: 'x'.repeat(900) })).toBe(
      true,
    );
    expect(
      isSighting({ ...valid, seen_on: '2099-01-01', lat_rounded: 6.9, lon_rounded: 80.1 }),
    ).toBe(true);
  });

  it.each([
    ['not an object', 'x'],
    ['null', null],
    ['missing id', { ...valid, id: '' }],
    ['undefined where null is required', { ...valid, note: undefined }],
    ['empty zone', { ...valid, zone: '' }],
    ['count 0', { ...valid, count: 0 }],
    ['fractional count', { ...valid, count: 1.5 }],
    ['string count', { ...valid, count: '2' }],
    ['non-number coordinate', { ...valid, lon_rounded: '80.1' }],
    ['infinite coordinate', { ...valid, lat_rounded: Infinity }],
    ['non-string note', { ...valid, note: 5 }],
    ['non-ISO timestamp', { ...valid, created_at: 'today' }],
    ['timestamp without milliseconds', { ...valid, created_at: '2026-11-10T08:00:00Z' }],
    ['impossible date', { ...valid, seen_on: '2026-02-30' }],
  ])('rejects %s', (_label, value) => {
    expect(isSighting(value)).toBe(false);
  });
});

describe('dates', () => {
  it('validates calendar dates', () => {
    expect(isCalendarDate('2028-02-29')).toBe(true);
    expect(isCalendarDate('2026-02-29')).toBe(false);
    expect(isCalendarDate('2026-1-1')).toBe(false);
  });

  it('uses the local date (tests run in Asia/Colombo)', () => {
    expect(toLocalDate(new Date('2026-11-18T19:00:00Z'))).toBe('2026-11-19');
    expect(toLocalDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('cleanFields', () => {
  it('turns blanks into null and keeps other text untouched', () => {
    const fields = { seen_on: '2026-11-10', place_name: '  ', note: '', zone: undefined };
    expect(cleanFields(fields)).toEqual({
      seen_on: '2026-11-10',
      place_name: null,
      zone: null,
      count: null,
      note: null,
    });
    expect(cleanFields({ seen_on: '2026-11-10', note: ' ශ්‍රී ' }).note).toBe(' ශ්‍රී ');
  });
});

describe('findFieldsError (write rules)', () => {
  const today = '2026-11-18';
  const fields = (over: Partial<CleanFields>): CleanFields => ({
    ...cleanFields({ seen_on: today }),
    ...over,
  });

  it.each([
    ['today', { seen_on: '2026-11-18' }],
    ['count 1', { count: 1 }],
    ['count 999', { count: 999 }],
    ['place 80', { place_name: 'x'.repeat(80) }],
    ['note 500', { note: 'x'.repeat(500) }],
    ['a known zone', { zone: 'montane' as const }],
  ])('accepts %s', (_label, over) => {
    expect(findFieldsError(fields(over), today)).toBeNull();
  });

  it.each([
    ['a future date', { seen_on: '2026-11-19' }],
    ['an impossible date', { seen_on: '2026-02-30' }],
    ['count 0', { count: 0 }],
    ['count 1000', { count: 1000 }],
    ['count 1.5', { count: 1.5 }],
    ['place 81', { place_name: 'x'.repeat(81) }],
    ['note 501', { note: 'x'.repeat(501) }],
    ['a bad zone', { zone: 'moon' as never }],
  ])('rejects %s', (_label, over) => {
    expect(findFieldsError(fields(over), today)).not.toBeNull();
  });
});
