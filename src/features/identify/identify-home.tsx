import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { radius, SCREEN_PADDING, size } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { currentMonth, serializeAnswers } from './answers-params';
import { STEPS } from './questions';

export function IdentifyHome(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.push({
            pathname: '/identify/[step]',
            params: { step: STEPS[0], ...serializeAnswers({ month: currentMonth() }) },
          })
        }
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={[typeStyle('title', language), { color: colors.badgeText }]}>
          {t('identify.start')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: SCREEN_PADDING },
  button: {
    minHeight: size.buttonLg * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
});
