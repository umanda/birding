import { useState } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';

import { MAX_COLOURS } from '@/shared/data/traits-vocabulary';
import type { Colour } from '@/shared/data/traits-vocabulary';
import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { borderWidth, radius, size, space, swatch } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { STEP_OPTIONS, toggleColour } from './questions';

const SWATCH_HEIGHT = 48;
const TICK = '✓ ';

type Props = {
  selected: readonly Colour[];
  language: Language;
  t: Translate;
  onChange: (colours: Colour[]) => void;
  onNotSure: () => void;
  onNext: () => void;
};

export function ColourGrid({
  selected,
  language,
  t,
  onChange,
  onNotSure,
  onNext,
}: Props): React.JSX.Element {
  const { colors } = useTheme();
  const [limitShown, setLimitShown] = useState(false);
  const count = t('identify.colourCount', { count: selected.length, max: MAX_COLOURS });
  const press = (colour: Colour): void => {
    const next = toggleColour(selected, colour);
    const blocked = next.length === selected.length; // toggleColour owns the limit
    setLimitShown(blocked);
    if (blocked) {
      void AccessibilityInfo.announceForAccessibility(limitNote);
      return;
    }
    onChange(next);
  };
  const limitNote = t('identify.colourLimit', { max: MAX_COLOURS });
  const note = [typeStyle('caption', language), { color: colors.text }];
  return (
    <View style={styles.wrap}>
      <Text style={note}>{count}</Text>
      <View role="group" style={styles.grid}>
        {STEP_OPTIONS.colour.map(({ value, labelKey }) => (
          <Pressable
            key={value}
            accessibilityRole="checkbox"
            accessibilityLabel={`${t(labelKey)}, ${count}`}
            accessibilityState={{ checked: selected.includes(value) }}
            aria-checked={selected.includes(value)}
            onPress={() => press(value)}
            style={styles.cell}
          >
            <View
              style={[
                styles.swatch,
                {
                  backgroundColor: swatch[value],
                  borderColor: colors.primary,
                  borderWidth: selected.includes(value) ? borderWidth.thick : borderWidth.thin,
                },
              ]}
            />
            <Text style={[typeStyle('label', language), styles.name, { color: colors.text }]}>
              {selected.includes(value) ? <Text aria-hidden>{TICK}</Text> : null}
              {t(labelKey)}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text accessibilityLiveRegion="polite" style={note}>
        {limitShown ? limitNote : ''}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onNotSure}
        style={[styles.button, { borderColor: colors.primary, borderWidth: borderWidth.thin }]}
      >
        <Text style={[typeStyle('label', language), { color: colors.text }]}>
          {t('identify.notSure')}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onNext}
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={[typeStyle('label', language), { color: colors.badgeText }]}>
          {t('identify.next')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space[3] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  cell: { flexBasis: '30%', flexGrow: 1, minHeight: size.touchMin, gap: space[1] },
  swatch: { height: SWATCH_HEIGHT, borderRadius: radius.md },
  name: { textAlign: 'center' },
  button: {
    minHeight: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
});
