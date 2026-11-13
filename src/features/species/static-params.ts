import { getAllSpecies } from '@/shared/data/content';

// ADR 0001: every species gets its own static HTML file.
export function speciesStaticParams(): { id: string }[] {
  return getAllSpecies().map(({ species_id }) => ({ id: species_id }));
}
