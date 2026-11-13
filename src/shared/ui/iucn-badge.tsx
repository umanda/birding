import { StyleSheet, Text, View } from 'react-native';

import type { IucnCategory } from '@/shared/data/content-schema';
import { radius, space } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { category: IucnCategory; label: string };

/** `label` is the screen-reader name, e.g. "Global status (working value)". */
export function IucnBadge({ category, label }: Props) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${category}`}
      style={[styles.badge, { borderColor: colors.textMuted }]}
    >
      <Text style={[styles.text, { color: colors.text }]}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space[2],
    paddingVertical: space[1],
  },
  text: { fontSize: 14, fontWeight: '600' },
});
