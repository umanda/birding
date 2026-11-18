import type { MessageKey, Translate } from '@/shared/i18n/translate';

// Spec 005 forbids Intl for dates (Hermes support varies), so months come from the message files.
// seen_on is a local calendar date; it is split, never passed to `new Date('YYYY-MM-DD')` (UTC).
export function formatSeenOn(seenOn: string, t: Translate): string {
  const [year = '', month = '1', day = '1'] = seenOn.split('-');
  const monthKey = `identify.monthName.${Number(month)}` as MessageKey;
  return t('sightings.date', { day: Number(day), month: t(monthKey), year });
}
