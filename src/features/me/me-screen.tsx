import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { SCREEN_PADDING, size } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

export function MeScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Link href="/photo-credits" accessibilityRole="link" style={styles.link}>
        <Text style={[typeStyle('body', language), { color: colors.primary }]}>
          {t('credits.title')}
        </Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: SCREEN_PADDING },
  link: { minHeight: size.touchMin, justifyContent: 'center' },
});
