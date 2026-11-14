import { TEXT_FIELDS, buildSpeciesText, detectLang } from './species-text';
import { validateSpeciesText } from './validate-content';

const NONE = { placeholdersCsv: 'species_id,field,reason\n', overridesCsv: 'species_id,field,lang\n' };
const SI = 'ශ්‍රී ලංකාවේ වැව් අසල දකිමු';
type Built = { species: Record<string, Record<string, { text: string; lang: string } | null>> };

const build = (cell: unknown, lists = NONE): Built =>
  buildSpeciesText(
    {
      identification: [{ species_id: 'a', species_description: cell }],
      distribution: [{ species_id: 'a', seasonality_months_seen: 'Oct-Apr' }],
    },
    lists,
  ) as Built;

describe('detectLang', () => {
  it.each([
    ['Sinhala', SI, 'si'],
    ['English', 'A small brown bird of reed beds.', 'en'],
    ['Sinhala with English loanwords', 'පිරිමි පක්ෂියාගේ හිස කොළ පැහැයි සහ පළල් හොට ඇත, plumage', 'si'],
    ['digits and punctuation only', '31 - 35 (cm); 2022.', 'en'],
    ['Sinhala with digits and punctuation', 'සෙ.මී. 31–35 පමණ, (2022)!', 'si'],
    ['Sinhala starting with an English name', 'Little Tern ට සමාන ඉතා කුඩා මුහුදුලිහිණියෙකි (සෙ.මී. 22–25).', 'si'],
    ['half and half', 'අඅඅඅඅ hello', 'si'],
    ['a trace of Sinhala in English', 'අ Seen on the coast near the lagoon', 'ambiguous'],
  ])('%s', (_name, text, expected) => {
    expect(detectLang(text)).toBe(expected);
  });
});

describe('buildSpeciesText', () => {
  it('keeps text byte-for-byte, including ZWJ and edge whitespace', () => {
    const cell = ` ${SI} \n`;
    expect(build(cell).species.a?.species_description).toEqual({ text: cell, lang: 'si' });
  });

  it('turns blank cells and listed placeholders into null', () => {
    expect(build('  ').species.a?.species_description).toBeNull();
    const placeholdersCsv = 'species_id,field,reason\na,species_description,not obtained\n';
    const built = build('Juvenile not obtained in this pass', { ...NONE, placeholdersCsv });
    expect(built.species.a?.species_description).toBeNull();
  });

  it('fails on an ambiguous cell unless an override lists it', () => {
    const ambiguous = 'අ Seen on the coast near the lagoon';
    expect(() => build(ambiguous)).toThrow('Ambiguous-language cell a|species_description');
    const overridesCsv = 'species_id,field,lang\na,species_description,si\n';
    expect(build(ambiguous, { ...NONE, overridesCsv }).species.a?.species_description?.lang).toBe('si');
  });

  it('fails when a list entry matches no cell', () => {
    const placeholdersCsv = 'species_id,field,reason\nzzz,species_description,x\n';
    expect(() => build('text', { ...NONE, placeholdersCsv })).toThrow('matches no cell');
  });
});

describe('validateSpeciesText', () => {
  it('reports missing and unknown species', () => {
    const record = Object.fromEntries(TEXT_FIELDS.map((f) => [f, { text: 'x', lang: 'en' }]));
    const text = { schema_version: 2, species: { a: record } };
    expect(validateSpeciesText(text, ['a'])).toEqual([]);
    expect(validateSpeciesText(text, ['b'])).toEqual([
      'species-text: missing b',
      'species-text: unknown a',
    ]);
  });

  it('rejects a record with a missing field', () => {
    const text = { schema_version: 2, species: { a: { species_description: null } } };
    expect(validateSpeciesText(text, ['a']).length).toBeGreaterThan(0);
  });
});
