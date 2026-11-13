import { getAllSpecies } from '@/shared/data/content';

export { SpeciesRoute as default } from '@/features/species';

// ADR 0001: every species gets its own static HTML file.
export function generateStaticParams(): { id: string }[] {
  return getAllSpecies().map(({ species_id }) => ({ id: species_id }));
}
