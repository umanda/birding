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
      {
        species_id: 'sp-c',
        plate_id: 'p1',
        plate_order: 3,
        names: { en: 'Draft Bird', si: null, scientific: 'Genus draftus' },
        occurrence_code: 'R',
        iucn_category: null,
      },
    ],
  },
  plan: [
    { species_id: 'sp-a', batch: '3' },
    { species_id: 'sp-c', batch: '5' },
  ],
  ledger: [
    { species_id: 'sp-a', batch: '3', unknown_traits: 'zone|month', reviewed_by: 'o', reviewed_at: '2026-11-18', note: 'no range text' },
  ],
  traits: [
    trait('colour', 'red', { plumage_key: 'male', source: 'expert:ornithologist', confidence: 'low', note: 'a|b' }),
    trait('colour', 'black', { plumage_key: 'male' }),
    trait('size', 'M'),
    trait('zone', 'montane', { species_id: 'sp-c', review_status: 'proposed' }),
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

describe('a batch that is drafted but not approved', () => {
  const sheet = renderBatchSheet('5', input);

  it('renders its proposed rows with no ledger row', () => {
    expect(sheet).toContain('# Traits review: batch 5');
    expect(sheet).toContain('## Draft Bird');
    expect(sheet).toContain('| zone | montane | - | workbook:species_description | high | proposed | - |');
    expect(sheet).toContain('Unknown: not in the ledger yet');
    expect(sheet).not.toContain('Test Bird');
  });
});

describe('committed review sheets', () => {
  it('match a fresh generation for every ledger batch', () => {
    expect(checkReviewSheets(loadSheetInput())).toEqual([]);
  });

  it('flags a sheet with no planned batch', () => {
    expect(checkReviewSheets({ ...loadSheetInput(), plan: [] }).join()).toMatch(/batch-00.md: no planned batch/);
  });

  it('reports a planned batch with no committed sheet', () => {
    const plan = [{ species_id: 'sp-a', batch: '99' }];
    expect(checkReviewSheets({ ...input, plan }).join()).toMatch(/batch-99\.md: missing/);
  });
});
