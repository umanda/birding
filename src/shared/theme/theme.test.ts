import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import { fontFamily } from './fonts';
import { colors, type } from './tokens';
import { useTheme } from './useTheme';

jest.mock('react-native/Libraries/Utilities/useColorScheme');
const mockScheme = jest.mocked(useColorScheme);

describe('tokens', () => {
  it('has identical colour keys in light and dark', async () => {
    expect(Object.keys(colors.dark)).toEqual(Object.keys(colors.light));
  });

  it('gives Sinhala a taller line height than Latin', async () => {
    for (const style of Object.values(type)) {
      expect(style.lineHeightSinhala).toBeGreaterThan(style.lineHeightLatin);
    }
  });
});

describe('useTheme', () => {
  it('returns dark tokens in dark scheme', async () => {
    mockScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.colors.bg).toBe('#121212');
  });

  it('falls back to light tokens when scheme is unknown', async () => {
    mockScheme.mockReturnValue(null);
    const { result } = await renderHook(() => useTheme());
    expect(result.current.mode).toBe('light');
  });
});

describe('fontFamily', () => {
  it('maps script and weight to a loaded font name', async () => {
    expect(fontFamily('sinhala', 600)).toBe('NotoSansSinhala_600SemiBold');
    expect(fontFamily('latin', 400)).toBe('NotoSans_400Regular');
  });
});
