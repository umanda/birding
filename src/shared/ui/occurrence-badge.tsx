import { StyleSheet, Text, View } from 'react-native';

import type { OccurrenceCode } from '@/shared/data/content-schema';
import type { MessageKey } from '@/shared/i18n/translate';
import { radius, space } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/use-theme';

type Appearance = {
  shape: string;
  wordKey: MessageKey;
  color: 'endemic' | 'resident' | 'migrant' | 'textMuted';
};

const SINGLE: Partial<Record<OccurrenceCode, Appearance>> = {
  E: { shape: '●', wordKey: 'occurrence.endemic', color: 'endemic' },
  R: { shape: '▲', wordKey: 'occurrence.resident', color: 'resident' },
  M: { shape: '◆', wordKey: 'occurrence.migrant', color: 'migrant' },
};
// Compound codes (R/M, R+M, R+(M)) get a neutral square so we never imply a single status.
const COMPOUND: Appearance = { shape: '■', wordKey: 'occurrence.mixed', color: 'textMuted' };

type Props = { code: OccurrenceCode; t: (key: MessageKey) => string };

export function OccurrenceBadge({ code, t }: Props) {
  const { colors } = useTheme();
  const { shape, wordKey, color } = SINGLE[code] ?? COMPOUND;
  const word = t(wordKey);

  return (
    <View
      accessible
      accessibilityLabel={`${code} ${word}`}
      style={[styles.badge, { backgroundColor: colors[color] }]}
    >
      <Text style={[styles.text, { color: colors.badgeText }]}>{`${shape} ${code} ${word}`}</Text>
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
  text: { fontSize: 14, fontWeight: '600' },
});
