import { StyleSheet, Text, View } from 'react-native';

import type { OccurrenceCode } from '@/shared/data/content-schema';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { radius, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Appearance = {
  shape: string;
  wordKey: MessageKey;
  color: 'endemic' | 'resident' | 'migrant' | 'textMuted';
};

export const SINGLE_APPEARANCE: Record<'E' | 'R' | 'M', Appearance> = {
  E: { shape: '●', wordKey: 'occurrence.endemic', color: 'endemic' },
  R: { shape: '▲', wordKey: 'occurrence.resident', color: 'resident' },
  M: { shape: '◆', wordKey: 'occurrence.migrant', color: 'migrant' },
};
// Compound codes (R/M, R+M, R+(M)) fall back to a neutral square so we never imply one status.
const COMPOUND: Appearance = { shape: '■', wordKey: 'occurrence.mixed', color: 'textMuted' };

function appearanceOf(code: OccurrenceCode): Appearance {
  return code === 'E' || code === 'R' || code === 'M' ? SINGLE_APPEARANCE[code] : COMPOUND;
}

type Props = { code: OccurrenceCode; language: Language; t: (key: MessageKey) => string };

export function OccurrenceBadge({ code, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const { shape, wordKey, color } = appearanceOf(code);
  const word = t(wordKey);

  return (
    <View
      accessible
      accessibilityLabel={`${code} ${word}`}
      style={[styles.badge, { backgroundColor: colors[color] }]}
    >
      <Text
        style={[typeStyle('label', language), { color: colors.badgeText }]}
      >{`${shape} ${code} ${word}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: space[2],
    paddingVertical: space[1],
  },
});
