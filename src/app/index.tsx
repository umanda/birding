import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { fontStyle } from '@/shared/theme/fonts';
import { BASE_FONT_SIZE, space, typography } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/use-theme';

export default function HomeScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen options={{ title: 'Sri Lanka Birds' }} />
      <Text style={[styles.title, { color: colors.text }]}>Sri Lanka Birds</Text>
      <Text style={[styles.sinhala, { color: colors.textMuted }]}>ශ්‍රී ලංකාවේ පක්ෂීන්</Text>
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
  title: {
    ...fontStyle('en', typography.display.weight),
    fontSize: typography.display.size * BASE_FONT_SIZE,
    lineHeight: typography.display.size * BASE_FONT_SIZE * typography.display.lineHeightLatin,
  },
  sinhala: {
    ...fontStyle('si', typography.body.weight),
    fontSize: typography.body.size * BASE_FONT_SIZE,
    lineHeight: typography.body.size * BASE_FONT_SIZE * typography.body.lineHeightSinhala,
  },
});
