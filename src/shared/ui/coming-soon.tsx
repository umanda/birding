import { StyleSheet, Text, View } from 'react-native';

import { space } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/use-theme';

type Props = { title: string; body: string };

export function ComingSoon({ title, body }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={{ color: colors.textMuted }}>{body}</Text>
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
  title: { fontSize: 20, fontWeight: '600' },
});
