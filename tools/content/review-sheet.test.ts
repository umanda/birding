import { checkReviewSheets, loadSheetInput, renderBatchSheet, type SheetInput } from './review-sheet';
import type { TraitRow } from './traits';

function trait(trait: string, value: string, extra: Partial<TraitRow> = {}): TraitRow {
  return {
    species_id: 'sp-a',
    trait,
    value,
    plumage_key: '',
    source: 'workbook:species_description',
    confidence: 'high',
    review_status: 'reviewed',
    note: '',
    ...extra,
  };
}

const input: SheetInput = {
  content: {
    schema_version: 1,
    source_file: 'x.xlsx',
    source_sha256: 'a'.repeat(64),
    plates: [{ plate_id: 'p1', plate_number: 7, title: { en: 'Plate', si: null } }],
    species: [
      {
        species_id: 'sp-a',
        plate_id: 'p1',
        plate_order: 2,
        names: { en: 'Test Bird', si: null, scientific: 'Genus species' },
        occurrence_code: 'E',
        iucn_category: null,
      },
    ],
  },
  ledger: [
    { species_id: 'sp-a', batch: '3', unknown_traits: 'zone|month', reviewed_by: 'o', reviewed_at: '2026-11-18', note: 'no range text' },
    { species_id: 'sp-b', batch: '4', unknown_traits: '', reviewed_by: 'o', reviewed_at: '2026-11-18', note: '' },
  ],
  traits: [
    trait('colour', 'red', { plumage_key: 'male', source: 'expert:ornithologist', confidence: 'low', note: 'a|b' }),
    trait('colour', 'black', { plumage_key: 'male' }),
    trait('size', 'M'),
  ],
  doubts: [{ species_id: 'sp-a', field: 'species_description', doubt: 'odd', suggested_source: 'a book' }],
  sensitive: [{ species_id: 'sp-a', reason: 'obscure_location' }],
};

describe('renderBatchSheet', () => {
  const sheet = renderBatchSheet('3', input);

  it('lists only the batch species, with names, plate and code', () => {
    expect(sheet).toContain('# Traits review: batch 3');
    expect(sheet).toContain('## Test Bird / (no Sinhala name) / *Genus species*');
    expect(sheet).toContain('Plate 7, slot 2. Occurrence code: E.');
    expect(sheet).not.toContain('sp-b');
  });

  it('shows flags, unknowns, ledger note and doubts', () => {
    expect(sheet).toContain('Flags: endemic; sensitive (obscure_location); 2 unknown core questions; 1 low-confidence; 1 expert-sourced');
    expect(sheet).toContain('Unknown: zone, month. Ledger note: no range text');
    expect(sheet).toContain('Workbook doubt (species_description): odd Check: a book');
  });

  it('groups rows by question in vocabulary order, names the question once and escapes pipes', () => {
    expect(sheet).toContain('| colour | red | male | expert:ornithologist | low | reviewed | a/b |');
    expect(sheet).toContain('|  | black | male |');
    expect(sheet.indexOf('| size |')).toBeLessThan(sheet.indexOf('| colour |'));
  });

  it('is deterministic', () => {
    expect(renderBatchSheet('3', input)).toBe(sheet);
  });
});

describe('committed review sheets', () => {
  it('match a fresh generation for every ledger batch', () => {
    expect(checkReviewSheets(loadSheetInput())).toEqual([]);
  });

  it('reports a ledger batch with no committed sheet', () => {
    expect(checkReviewSheets(input).join()).toMatch(/batch-03\.md: missing/);
  });
});
