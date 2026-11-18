import { createT } from '@/shared/i18n/translate';

import { formatSeenOn } from './sighting-date';

describe('formatSeenOn', () => {
  it('writes the day, month name and year from the stored local date', () => {
    expect(formatSeenOn('2026-11-08', createT('en'))).toBe('8 November 2026');
    expect(formatSeenOn('2026-01-31', createT('si'))).toContain('31');
  });
});
