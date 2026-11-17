import { Pressable, StyleSheet, Text } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { size } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { count: number; language: Language; t: Translate; onPress: () => void };

export function MatchFooter({ count, language, t, onPress }: Props): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.footer, { backgroundColor: colors.primary }]}
    >
      <Text
        accessibilityLiveRegion="polite"
        style={[typeStyle('label', language), { color: colors.badgeText }]}
      >
        {count > 0 ? t('identify.seeMatches', { count }) : t('identify.noMatches')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  footer: { minHeight: size.buttonLg, alignItems: 'center', justifyContent: 'center' },
});
