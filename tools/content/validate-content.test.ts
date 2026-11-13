import { EXPECTED_PLATES, EXPECTED_SPECIES, validateContent } from './validate-content';

function makeContent() {
  const plates = Array.from({ length: EXPECTED_PLATES }, (_, i) => ({
    plate_id: `plate-${i + 1}`,
    plate_number: i + 1,
    title: { en: `Plate ${i + 1}`, si: null as string | null },
  }));
  const species = Array.from({ length: EXPECTED_SPECIES }, (_, i) => ({
    species_id: `slb-${i}`,
    plate_id: `plate-${(i % EXPECTED_PLATES) + 1}`,
    plate_order: Math.floor(i / EXPECTED_PLATES) + 1,
    names: { en: `Bird ${i}`, si: 'පනන්කුකුළා' as string | null, scientific: `Genus species${i}` },
    occurrence_code: 'R+(M)',
    iucn_category: 'LC' as string | null,
  }));
  return {
    schema_version: 1,
    source_file: 'x.xlsx',
    source_sha256: 'a'.repeat(64),
    plates,
    species,
  };
}

type Content = ReturnType<typeof makeContent>;

function at<T>(items: T[], index: number): T {
  const item = items[index];
  if (item === undefined) throw new Error(`No item at ${index}`);
  return item;
}

// Applies a change to the first species so each test states only what is broken.
function withFirstSpecies(patch: Partial<Content['species'][number]>): Content {
  const content = makeContent();
  Object.assign(at(content.species, 0), patch);
  return content;
}

describe('validateContent', () => {
  it('accepts valid content', () => {
    expect(validateContent(makeContent()).errors).toEqual([]);
  });

  it('fails on a duplicate species_id', () => {
    const content = makeContent();
    Object.assign(at(content.species, 1), { species_id: 'slb-0' });
    expect(validateContent(content).errors).toContain('Duplicate species_id: slb-0');
  });

  it('fails on a duplicate plate_id', () => {
    const content = makeContent();
    Object.assign(at(content.plates, 1), { plate_id: 'plate-1' });
    expect(validateContent(content).errors).toContain('Duplicate plate_id: plate-1');
  });

  it('fails on a broken plate foreign key', () => {
    const errors = validateContent(withFirstSpecies({ plate_id: 'plate-999' })).errors;
    expect(errors).toContain('slb-0: unknown plate_id plate-999');
  });

  it('fails on an unknown occurrence code', () => {
    const errors = validateContent(withFirstSpecies({ occurrence_code: 'X' })).errors;
    expect(errors.join()).toContain('species[slb-0].occurrence_code');
  });

  it('fails on an unknown IUCN category', () => {
    const errors = validateContent(withFirstSpecies({ iucn_category: 'ZZ' })).errors;
    expect(errors.join()).toContain('species[slb-0].iucn_category');
  });

  it('fails on a missing English name', () => {
    const content = makeContent();
    Object.assign(at(content.species, 0).names, { en: '' });
    expect(validateContent(content).errors.join()).toContain('species[slb-0].names.en');
  });

  it('fails on unexpected counts', () => {
    const content = makeContent();
    content.species.pop();
    expect(validateContent(content).errors).toContain(
      `Expected ${EXPECTED_SPECIES} species, found ${EXPECTED_SPECIES - 1}`,
    );
  });

  it('warns, without failing, on a blank Sinhala name', () => {
    const content = makeContent();
    Object.assign(at(content.species, 0).names, { si: null });
    const result = validateContent(content);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain('slb-0: blank Sinhala name');
  });

  it('fails on a duplicate (plate_id, plate_order) slot', () => {
    const content = makeContent();
    Object.assign(at(content.species, 1), { plate_id: 'plate-1', plate_order: 1 });
    expect(validateContent(content).errors).toContain('Duplicate plate_order slot: plate-1#1');
  });

  it('fails on a wrong plate count', () => {
    const content = makeContent();
    content.plates.pop();
    expect(validateContent(content).errors).toContain(
      `Expected ${EXPECTED_PLATES} plates, found ${EXPECTED_PLATES - 1}`,
    );
  });

  it('warns on non-NFC Sinhala without changing it', () => {
    const decomposed = 'é'; // not NFC
    const content = withFirstSpecies({});
    Object.assign(at(content.species, 0).names, { si: decomposed });
    expect(validateContent(content).warnings).toContain('slb-0: Sinhala name is not NFC');
  });

  it('warns on a blank IUCN category', () => {
    const result = validateContent(withFirstSpecies({ iucn_category: null }));
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain('slb-0: blank IUCN category');
  });

  it('warns on edge whitespace and on a blank plate Sinhala title', () => {
    const content = withFirstSpecies({});
    Object.assign(at(content.species, 0).names, { en: ' Bird ' });
    const { warnings } = validateContent(content);
    expect(warnings).toContain('slb-0: name has edge whitespace');
    expect(warnings).toContain('plate-1: blank Sinhala title');
  });
});
