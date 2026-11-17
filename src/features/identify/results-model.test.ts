import type { Translate } from '@/shared/i18n/translate';

import { serializeAnswers } from './answers-params';
import {
  answerChips,
  firstUnanswered,
  flagParts,
  resultsView,
  unansweredCount,
  whyParts,
  withoutAnswer,
} from './results-model';
import type { Answers, RankedSpecies } from './types';

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

describe('flagParts', () => {
  it('pairs each flag with its glyph and label', () => {
    expect(flagParts(['not-usually-here', 'data-incomplete'], t)).toEqual([
      { glyph: '⚑', label: 'identify.flag.not-usually-here' },
      { glyph: 'ⓘ', label: 'identify.flag.data-incomplete' },
    ]);
  });
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

  it('removing the month leaves the "any month" choice in the params', () => {
    expect(serializeAnswers(withoutAnswer(answers, 'month')).month).toBe('any');
  });

  it('adds a chip for colours (one chip, all names) and behaviour', () => {
    const chips = answerChips({ colours: ['red', 'blue'], behaviour: 'aerial' }, t);
    expect(chips.map((c) => c.field)).toEqual(['colours', 'behaviour']);
    expect(chips[0]?.label).toBe('identify.colour.red, identify.colour.blue');
    expect(chips[1]?.label).toBe('identify.behaviour.aerial');
  });

  it('removes the whole colours answer with its chip', () => {
    expect(withoutAnswer({ ...answers, colours: ['red'] }, 'colours')).toEqual(answers);
  });

  it('finds the first unanswered step and how many are left', () => {
    expect(firstUnanswered(answers)).toBe('habitat');
    expect(unansweredCount(answers)).toBe(3);
    const complete: Answers = {
      ...answers,
      habitat: 'forest',
      colours: ['red'],
      behaviour: 'aerial',
    };
    expect(firstUnanswered(complete)).toBeUndefined();
    expect(firstUnanswered({ ...answers, habitat: 'forest' })).toBe('colour');
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
