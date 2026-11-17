import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { MessageKey, Translate } from '@/shared/i18n/translate';
import { borderWidth, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type OptionProps = { label: string; selected: boolean; language: Language; onPress: () => void };

export function AnswerOption({
  label,
  selected,
  language,
  onPress,
}: OptionProps): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      aria-checked={selected}
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: colors.primary,
          borderWidth: selected ? borderWidth.thick : borderWidth.thin,
        },
      ]}
    >
      <Text style={[typeStyle('body', language), { color: colors.text }]}>
        {selected ? <Text aria-hidden>{'✓ '}</Text> : null}
        {label}
      </Text>
    </Pressable>
  );
}

type Option = { value: string; labelKey: MessageKey };
type ListProps = {
  options: readonly Option[];
  selected: string | undefined;
  language: Language;
  t: Translate;
  onSelect: (value: string | undefined) => void; // undefined is "Not sure"
};

export function AnswerList({
  options,
  selected,
  language,
  t,
  onSelect,
}: ListProps): React.JSX.Element {
  return (
    <View role="radiogroup" style={styles.list}>
      {options.map(({ value, labelKey }) => (
        <AnswerOption
          key={value}
          label={t(labelKey)}
          selected={value === selected}
          language={language}
          onPress={() => onSelect(value)}
        />
      ))}
      <AnswerOption
        label={t('identify.notSure')}
        selected={false}
        language={language}
        onPress={() => onSelect(undefined)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space[2] },
  card: {
    minHeight: size.rowMin,
    justifyContent: 'center',
    padding: space[3],
    borderRadius: radius.md,
  },
});
