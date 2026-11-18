import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ZONES } from '@/shared/data/traits-vocabulary';
import type { Zone } from '@/shared/data/traits-vocabulary';
import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { borderWidth, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Props = {
  zone: Zone | null;
  language: Language;
  t: Translate;
  onChange: (zone: Zone | null) => void;
};

/** Single-select zone chips. Tapping the selected chip clears it. */
export function ZoneChips({ zone, language, t, onChange }: Props): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View role="radiogroup" style={styles.row}>
      {ZONES.map((value) => {
        const checked = zone === value;
        return (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityLabel={t(`identify.zone.${value}`)}
            accessibilityState={{ checked }}
            aria-checked={checked}
            onPress={() => onChange(checked ? null : value)}
            style={[
              styles.chip,
              {
                borderColor: colors.primary,
                borderWidth: checked ? borderWidth.thick : borderWidth.thin,
              },
            ]}
          >
            <Text style={[typeStyle('body', language), { color: colors.text }]}>
              {checked ? <Text aria-hidden>{'✓ '}</Text> : null}
              {t(`identify.zone.${value}`)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    minHeight: size.rowMin,
    minWidth: size.rowMin,
    paddingHorizontal: space[3],
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
});
