import { getPlates } from '@/shared/data/content';

// ADR 0001: every plate gets its own static HTML file.
export function plateStaticParams(): { id: string }[] {
  return getPlates().map(({ plate_id }) => ({ id: plate_id }));
}
