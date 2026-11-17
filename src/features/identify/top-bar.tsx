import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import { SCREEN_PADDING, size } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = {
  backLabel: string;
  language: Language;
  onBack: () => void;
  children?: React.ReactNode; // the month chip
};

export function TopBar({ backLabel, language, onBack, children }: Props): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        onPress={onBack}
        style={styles.back}
      >
        <Text style={[typeStyle('label', language), { color: colors.primary }]}>
          <Text aria-hidden>{'‹ '}</Text>
          {backLabel}
        </Text>
      </Pressable>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-between', padding: SCREEN_PADDING },
  back: { minHeight: size.rowMin, justifyContent: 'center' },
});
