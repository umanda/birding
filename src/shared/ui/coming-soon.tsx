import { StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { language: Language; t: (key: MessageKey) => string };

export function ComingSoon({ language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {t('comingSoon.title')}
      </Text>
      <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
        {t('comingSoon.body')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[2],
    padding: space[4],
  },
});
