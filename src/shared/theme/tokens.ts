// Mirrors docs/design/01-ux-flows.md section 8. Keep in sync; no raw hex elsewhere.

export type ColorMode = 'light' | 'dark';

const pair = (light: string, dark: string) => ({ light, dark });

const colorPairs = {
  bg: pair('#FFFFFF', '#121212'),
  surface: pair('#F4F4F2', '#1E1E1E'),
  text: pair('#1A1A1A', '#F2F2F2'),
  textMuted: pair('#555555', '#B8B8B8'),
  primary: pair('#1F5E3B', '#7FD1A0'),
  focus: pair('#0B57D0', '#A8C7FA'),
  error: pair('#B3261E', '#F2B8B5'),
  endemic: pair('#1B7A3E', '#6FD08C'),
  resident: pair('#B45309', '#FDBA74'),
  migrant: pair('#1D4ED8', '#93C5FD'),
  badgeText: pair('#FFFFFF', '#121212'), // text on E/R/M badge fills
};

export type ColorName = keyof typeof colorPairs;
export type Colors = Record<ColorName, string>;

function pickMode(mode: ColorMode): Colors {
  const names = Object.keys(colorPairs) as ColorName[];
  return Object.fromEntries(names.map((name) => [name, colorPairs[name][mode]])) as Colors;
}

export const colors: Record<ColorMode, Colors> = {
  light: pickMode('light'),
  dark: pickMode('dark'),
};

export type TypeStyle = {
  size: number; // rem at 16px
  weight: 400 | 600 | 700;
  lineHeightLatin: number;
  lineHeightSinhala: number;
};

export const BASE_FONT_SIZE = 16;

// camelCase keys: these are data objects, not scalar constants.
export const typography = {
  display: { size: 1.75, weight: 700, lineHeightLatin: 1.3, lineHeightSinhala: 1.5 },
  title: { size: 1.25, weight: 600, lineHeightLatin: 1.3, lineHeightSinhala: 1.5 },
  body: { size: 1.0, weight: 400, lineHeightLatin: 1.4, lineHeightSinhala: 1.7 },
  label: { size: 0.875, weight: 600, lineHeightLatin: 1.3, lineHeightSinhala: 1.6 },
  caption: { size: 0.8125, weight: 400, lineHeightLatin: 1.35, lineHeightSinhala: 1.6 },
} satisfies Record<string, TypeStyle>;

export type TypeName = keyof typeof typography;

export const space = [0, 4, 8, 12, 16, 24, 32, 48] as const;
export const SCREEN_PADDING = 16;

export const radius = { sm: 6, md: 12, lg: 20, pill: 999 } as const;

export const size = {
  touchMin: 44,
  tabBar: 56,
  appBar: 56,
  fab: 56,
  buttonLg: 56,
  rowMin: 56,
} as const;
