import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '@/shared/theme/fonts';
import { BASE_FONT_SIZE, space, type } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/useTheme';

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
    fontFamily: fontFamily('latin', type.display.weight),
    fontSize: type.display.size * BASE_FONT_SIZE,
    lineHeight: type.display.size * BASE_FONT_SIZE * type.display.lineHeightLatin,
  },
  sinhala: {
    fontFamily: fontFamily('sinhala', type.body.weight),
    fontSize: type.body.size * BASE_FONT_SIZE,
    lineHeight: type.body.size * BASE_FONT_SIZE * type.body.lineHeightSinhala,
  },
});
