import { localized, otherLanguage } from './localized';

describe('localized', () => {
  const value = { en: 'Bird', si: 'කුරුල්ලා' };

  it('returns the requested language', () => {
    expect(localized(value, 'si')).toEqual({ text: 'කුරුල්ලා', language: 'si' });
    expect(localized(value, 'en')).toEqual({ text: 'Bird', language: 'en' });
  });

  it('falls back to English and reports it', () => {
    expect(localized({ en: 'Bird', si: null }, 'si')).toEqual({ text: 'Bird', language: 'en' });
  });

  it('names the other language', () => {
    expect(otherLanguage('si')).toBe('en');
    expect(otherLanguage('en')).toBe('si');
  });
});
