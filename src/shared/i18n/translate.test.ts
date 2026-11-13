import en from './locales/en.json';
import si from './locales/si.json';
import { createT, translate } from './translate';

describe('translate', () => {
  const messages = {
    greet: 'Hello {name}',
    'birds.one': '{count} bird',
    'birds.other': '{count} birds',
  };

  it('interpolates variables and keeps unknown placeholders', () => {
    expect(translate(messages, 'en', 'greet', { name: 'Kumar' })).toBe('Hello Kumar');
    expect(translate(messages, 'en', 'greet')).toBe('Hello {name}');
  });

  it('picks the plural form from count', () => {
    expect(translate(messages, 'en', 'birds', { count: 1 })).toBe('1 bird');
    expect(translate(messages, 'en', 'birds', { count: 5 })).toBe('5 birds');
  });

  it('returns the key when it is missing', () => {
    expect(translate(messages, 'en', 'nope')).toBe('nope');
  });

  it('has the same keys in si.json and en.json', () => {
    expect(Object.keys(si).sort()).toEqual(Object.keys(en).sort());
  });

  it('translates with the chosen language', () => {
    expect(createT('si')('app.title')).toBe(si['app.title']);
    expect(createT('en')('app.title')).toBe('Sri Lanka Birds');
  });

  it('accepts a plural base key in the typed t()', () => {
    const t = createT('en');
    expect(t('search.results', { count: 1 })).toBe('1 result');
    expect(t('search.results', { count: 3 })).toBe('3 results');
  });
});
