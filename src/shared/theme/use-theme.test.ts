import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';

import { colors } from './tokens';
import { useTheme } from './use-theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme');
const mockScheme = jest.mocked(useColorScheme);

describe('useTheme', () => {
  it('returns dark tokens in dark scheme', async () => {
    mockScheme.mockReturnValue('dark');
    const { result } = await renderHook(() => useTheme());
    expect(result.current.colors).toBe(colors.dark);
  });

  it('falls back to light tokens when scheme is unknown', async () => {
    mockScheme.mockReturnValue(null);
    const { result } = await renderHook(() => useTheme());
    expect(result.current.colors).toBe(colors.light);
  });
});
