import { isCalendarDate, isSighting, toLocalDate, type Sighting } from './sighting';

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

describe('isSighting', () => {
  it('accepts a full row', () => {
    expect(isSighting(valid)).toBe(true);
    expect(
      isSighting({ ...valid, zone: 'montane', count: 999, deleted_at: valid.created_at }),
    ).toBe(true);
  });

  it.each([
    ['not an object', 'x'],
    ['null', null],
    ['missing id', { ...valid, id: '' }],
    ['undefined where null is required', { ...valid, note: undefined }],
    ['bad zone', { ...valid, zone: 'moon' }],
    ['count 0', { ...valid, count: 0 }],
    ['string count', { ...valid, count: '2' }],
    ['stored coordinates', { ...valid, lon_rounded: 80.1 }],
    ['non-ISO timestamp', { ...valid, created_at: 'today' }],
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

  it('formats the local date', () => {
    expect(toLocalDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});
