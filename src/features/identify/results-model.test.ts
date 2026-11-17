import type { Translate } from '@/shared/i18n/translate';

import {
  answerChips,
  firstUnanswered,
  flagLabels,
  resultsView,
  unansweredCount,
  whyParts,
  withoutAnswer,
} from './results-model';
import type { RankedSpecies } from './types';

const t: Translate = (key, vars) => (vars ? `${key} ${JSON.stringify(vars)}` : key);
const ranked = (id: string, flags: RankedSpecies['flags'] = []): RankedSpecies => ({
  species_id: id,
  score: 0,
  descriptionScore: 0,
  reasons: [],
  flags,
});

describe('whyParts', () => {
  it('pairs a decorative glyph with spoken text and skips unknown fits', () => {
    const parts = whyParts(
      [
        { field: 'size', fit: 'partial' },
        { field: 'habitat', fit: 'unknown' },
        { field: 'zone', fit: 'mismatch' },
        { field: 'month', fit: 'match' },
      ],
      t,
    );
    expect(parts.map((p) => p.glyph)).toEqual(['≈', '✗', '✓']);
    expect(parts[0]?.spoken).toBe('identify.field.size: identify.fit.partial');
  });
});

it('turns flags into their labels', () => {
  expect(flagLabels(['not-usually-here', 'data-incomplete'], t)).toEqual([
    'identify.flag.not-usually-here',
    'identify.flag.data-incomplete',
  ]);
});

describe('answers', () => {
  const answers = { month: 7, zone: 'montane', size: 'M' } as const;

  it('lists chips in question order, only for answered questions', () => {
    expect(answerChips(answers, t).map((c) => c.field)).toEqual(['month', 'zone', 'size']);
    expect(answerChips({}, t)).toEqual([]);
  });

  it('removes one answer and keeps the rest', () => {
    expect(withoutAnswer(answers, 'zone')).toEqual({ month: 7, size: 'M' });
  });

  it('finds the first unanswered step and how many are left', () => {
    expect(firstUnanswered(answers)).toBe('habitat');
    expect(unansweredCount(answers)).toBe(1);
    expect(firstUnanswered({ ...answers, habitat: 'forest' })).toBeUndefined();
  });
});

describe('resultsView', () => {
  it('shows matches only when there are some', () => {
    const view = resultsView([ranked('a'), ranked('b', ['not-usually-here'])]);
    expect(view.matches.map((s) => s.species_id)).toEqual(['a']);
    expect(view.closest).toEqual([]);
  });

  it('falls back to the 5 closest when nothing matches', () => {
    const all = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ranked(id, ['not-usually-now']));
    const view = resultsView(all);
    expect(view.matches).toEqual([]);
    expect(view.closest.map((s) => s.species_id)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
