import { useColorScheme } from 'react-native';

import { colors, type ColorMode } from './tokens';

export function useTheme() {
  const mode: ColorMode = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { mode, colors: colors[mode] };
}
