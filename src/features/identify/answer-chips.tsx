import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { borderWidth, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import type { Chip } from './results-model';
import type { Answers } from './types';

type Props = {
  chips: Chip[];
  language: Language;
  t: Translate;
  onRemove: (field: keyof Answers) => void;
};

export function AnswerChips({ chips, language, t, onRemove }: Props): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {chips.map(({ field, label }) => (
        <Pressable
          key={field}
          accessibilityRole="button"
          accessibilityLabel={t('identify.chip.remove', { label })}
          onPress={() => onRemove(field)}
          style={[styles.chip, { borderColor: colors.primary }]}
        >
          <Text style={[typeStyle('label', language), { color: colors.text }]}>
            {label} <Text aria-hidden>×</Text>
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space[3],
    borderWidth: borderWidth.thin,
    borderRadius: radius.pill,
  },
});
