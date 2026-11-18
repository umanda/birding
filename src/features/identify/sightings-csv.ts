import type { Answers } from './types';
import type {
  Behaviour,
  Colour,
  Habitat,
  Month,
  SizeClass,
  Zone,
} from '@/shared/data/traits-vocabulary';

// drafter wrote the traits and the scenario; other is a second person; plates was written from
// plates or photos before the trait rows existed. Only drafter scenarios are self-confirming.
export const SCENARIO_SOURCES = ['drafter', 'other', 'plates'] as const;
export type ScenarioSource = (typeof SCENARIO_SOURCES)[number];

export type TestSighting = {
  sighting_id: string;
  expected_species_id: string;
  demo: boolean;
  scenario_source: string; // checked by checkSightings, not trusted here
  hard_group: string; // test-only; blank for easy scenarios
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
      scenario_source: row.scenario_source ?? '',
      hard_group: row.hard_group ?? '',
      answers: toAnswers(row),
    };
  });
}

const HARD_GROUP_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Boundary check for the test set; returns one message per problem.
export function checkSightings(sightings: TestSighting[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const s of sightings) {
    if (seen.has(s.sighting_id)) errors.push(`${s.sighting_id}: duplicate sighting_id`);
    seen.add(s.sighting_id);
    if (!(SCENARIO_SOURCES as readonly string[]).includes(s.scenario_source)) {
      errors.push(
        `${s.sighting_id}: scenario_source "${s.scenario_source}" is not one of ${SCENARIO_SOURCES.join(', ')}`,
      );
    }
    if (s.hard_group !== '' && !HARD_GROUP_NAME.test(s.hard_group)) {
      errors.push(
        `${s.sighting_id}: hard_group "${s.hard_group}" must be a lowercase-dash name or blank`,
      );
    }
  }
  return errors;
}
