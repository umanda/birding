import { fontStyle } from './fonts';

describe('fontStyle', () => {
  it('uses the system font for Latin and keeps the weight', () => {
    expect(fontStyle('en', 600)).toEqual({ fontFamily: undefined, fontWeight: '600' });
  });

  it('uses Noto Sans Sinhala regular for 400', () => {
    expect(fontStyle('si', 400)).toEqual({
      fontFamily: 'NotoSansSinhala_400Regular',
      fontWeight: '400',
    });
  });

  it('maps Sinhala 600 to the bold face', () => {
    expect(fontStyle('si', 600)).toEqual({
      fontFamily: 'NotoSansSinhala_700Bold',
      fontWeight: '700',
    });
  });
});
