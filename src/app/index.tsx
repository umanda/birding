import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { fontStyle } from '@/shared/theme/fonts';
import { BASE_FONT_SIZE, space, typography } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/use-theme';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { language, t } = useSettings();
  const { size, weight, lineHeightLatin, lineHeightSinhala } = typography.display;
  const fontSize = size * BASE_FONT_SIZE;
  const lineHeight = fontSize * (language === 'si' ? lineHeightSinhala : lineHeightLatin);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen options={{ title: t('app.title') }} />
      <Text style={[fontStyle(language, weight), { fontSize, lineHeight, color: colors.text }]}>
        {t('app.title')}
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
  },
});
