import { useColorScheme } from 'react-native';

import { colors, type ColorMode, type Colors } from './tokens';

export type Theme = { mode: ColorMode; colors: Colors };

export function useTheme(): Theme {
  const mode: ColorMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { mode, colors: colors[mode] };
}
