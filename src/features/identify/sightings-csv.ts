import type { Answers } from './types';
import type {
  Behaviour,
  Colour,
  Habitat,
  Month,
  SizeClass,
  Zone,
} from '@/shared/data/traits-vocabulary';

export type TestSighting = {
  sighting_id: string;
  expected_species_id: string;
  demo: boolean;
  answers: Answers;
};

const COLOUR_SEPARATOR = '|';

// Blank cells are skipped questions, so they are left out of the answers.
function toAnswers(row: Record<string, string>): Answers {
  const answers: Answers = {};
  if (row.month) answers.month = Number(row.month) as Month;
  if (row.zone) answers.zone = row.zone as Zone;
  if (row.habitat) answers.habitat = row.habitat as Habitat;
  if (row.size) answers.size = row.size as SizeClass;
  if (row.colours) answers.colours = row.colours.split(COLOUR_SEPARATOR) as Colour[];
  if (row.behaviour) answers.behaviour = row.behaviour as Behaviour;
  return answers;
}

// The file has a header row and no quoted fields, so a plain split is enough.
export function parseSightings(csv: string): TestSighting[] {
  const [header = '', ...lines] = csv.split(/\r?\n/).filter((line) => line.trim() !== '');
  const names = header.split(',');
  return lines.map((line) => {
    const cells = line.split(',');
    const row = Object.fromEntries(names.map((name, i) => [name, cells[i] ?? '']));
    return {
      sighting_id: row.sighting_id ?? '',
      expected_species_id: row.expected_species_id ?? '',
      demo: row.demo === 'yes',
      answers: toAnswers(row),
    };
  });
}
