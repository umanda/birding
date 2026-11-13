import { colors, typography } from './tokens';

describe('tokens', () => {
  it('has identical colour keys in light and dark', () => {
    expect(Object.keys(colors.dark)).toEqual(Object.keys(colors.light));
  });

  it('gives Sinhala a taller line height than Latin', () => {
    for (const style of Object.values(typography)) {
      expect(style.lineHeightSinhala).toBeGreaterThan(style.lineHeightLatin);
    }
  });
});
