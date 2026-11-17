import { MESSAGES } from '@/shared/i18n/translate';

import { FIXTURE_TRAITS } from './test-traits.fixture';
import {
  countMatches,
  isStep,
  neighbour,
  questionStaticParams,
  STEP_OPTIONS,
  withAnswer,
} from './questions';

describe('steps', () => {
  it('walks zone, habitat, size and stops at both ends', () => {
    expect(neighbour('zone', -1)).toBeUndefined();
    expect(neighbour('zone', 1)).toBe('habitat');
    expect(neighbour('size', 1)).toBeUndefined();
    expect(isStep('size')).toBe(true);
    expect(isStep('results')).toBe(false);
  });
});

describe('withAnswer', () => {
  it('sets an answer and Not sure clears it', () => {
    const answered = withAnswer({ month: 5 }, 'zone', 'montane');
    expect(answered).toEqual({ month: 5, zone: 'montane' });
    expect(withAnswer(answered, 'zone', undefined).zone).toBeUndefined();
  });
});

describe('countMatches', () => {
  it('counts every species when nothing is answered', () => {
    expect(countMatches(FIXTURE_TRAITS, {})).toBe(2);
  });

  it('leaves out species that are not usually in the answered zone', () => {
    expect(countMatches(FIXTURE_TRAITS, { zone: 'wet_lowland' })).toBe(1);
  });

  it('is 0 for no species', () => {
    expect(countMatches([], {})).toBe(0);
  });
});

describe('questionStaticParams', () => {
  it('lists every step', () => {
    expect(questionStaticParams()).toEqual([
      { step: 'zone' },
      { step: 'habitat' },
      { step: 'size' },
    ]);
  });
});

describe('STEP_OPTIONS', () => {
  it('has an en and si label for every option', () => {
    const keys = Object.values(STEP_OPTIONS).flatMap((options) => options.map((o) => o.labelKey));
    for (const key of keys) {
      expect(MESSAGES.en[key]).toBeTruthy();
      expect(MESSAGES.si[key]).toBeTruthy();
    }
  });
});
