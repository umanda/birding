import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { MONTHS } from '@/shared/data/traits-vocabulary';
import type { Month } from '@/shared/data/traits-vocabulary';
import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { borderWidth, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

const BACKDROP_OPACITY = 0.4;

type Props = {
  month: Month | undefined; // undefined is "Any month"
  language: Language;
  t: Translate;
  onOpen: () => void;
  onPick: (month: Month | undefined) => void;
};

/** The month chip and the sheet it opens. */
export function MonthPicker({ month, language, t, onOpen, onPick }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const nameOf = (m: Month | undefined): string =>
    m ? t(`identify.monthName.${m}`) : t('identify.monthAny');
  const pick = (picked: Month | undefined): void => {
    setOpen(false);
    onPick(picked);
  };
  const options = [...MONTHS, undefined];

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('identify.month', { month: nameOf(month) })}
        onPress={() => {
          onOpen();
          setOpen(true);
        }}
        style={[styles.chip, { borderColor: colors.primary }]}
      >
        <Text style={[typeStyle('label', language), { color: colors.text }]}>
          {t('identify.month', { month: nameOf(month) })}
          <Text aria-hidden>{' ▾'}</Text>
        </Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('identify.close')}
            onPress={() => setOpen(false)}
            style={StyleSheet.absoluteFill}
          >
            <View
              style={[StyleSheet.absoluteFill, styles.backdrop, { backgroundColor: colors.text }]}
            />
          </Pressable>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <Text
              accessibilityRole="header"
              style={[typeStyle('title', language), { color: colors.text }]}
            >
              {t('identify.monthTitle')}
            </Text>
            <View role="radiogroup" style={styles.options}>
              {options.map((value) => {
                const selected = value === month;
                return (
                  <Pressable
                    key={value ?? 'any'}
                    accessibilityRole="radio"
                    accessibilityLabel={nameOf(value)}
                    accessibilityState={{ checked: selected }}
                    aria-checked={selected}
                    onPress={() => pick(value)}
                    style={[
                      styles.option,
                      {
                        borderColor: colors.primary,
                        borderWidth: selected ? borderWidth.thick : borderWidth.thin,
                      },
                    ]}
                  >
                    <Text style={[typeStyle('body', language), { color: colors.text }]}>
                      {selected ? <Text aria-hidden>{'✓ '}</Text> : null}
                      {nameOf(value)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: size.rowMin,
    justifyContent: 'center',
    paddingHorizontal: space[3],
    borderWidth: borderWidth.thin,
    borderRadius: radius.pill,
  },
  modal: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { opacity: BACKDROP_OPACITY },
  sheet: {
    padding: space[4],
    gap: space[3],
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  option: {
    minHeight: size.rowMin,
    minWidth: size.rowMin,
    paddingHorizontal: space[3],
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
});
