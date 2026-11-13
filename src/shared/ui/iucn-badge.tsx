import { StyleSheet, Text, View } from 'react-native';

import type { IucnCategory } from '@/shared/data/content-schema';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { radius, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { category: IucnCategory; language: Language; t: (key: MessageKey) => string };

export function IucnBadge({ category, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${t('iucn.label')}: ${t(`iucn.${category}`)}`}
      style={[styles.badge, { borderColor: colors.textMuted }]}
    >
      <Text style={[typeStyle('label', language), { color: colors.text }]}>{category}</Text>
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
});
