import { isLanguage, languageFromLocale } from './language';

describe('language', () => {
  it('recognises supported languages only', () => {
    expect(isLanguage('si')).toBe(true);
    expect(isLanguage('xx')).toBe(false);
    expect(isLanguage(null)).toBe(false);
  });

  it('maps device locale to a language', () => {
    expect(languageFromLocale('si')).toBe('si');
    expect(languageFromLocale('ta')).toBe('en');
    expect(languageFromLocale(null)).toBe('en');
  });
});
