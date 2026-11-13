import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LANGUAGES } from '@/shared/i18n/language';
import type { Language } from '@/shared/i18n/language';

import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { useSettings } from './settings-context';

// Endonyms: each language is always named in its own script.
const SEGMENTS: Record<Language, { text: string; name: string }> = {
  si: { text: 'සිං', name: 'සිංහල' },
  en: { text: 'EN', name: 'English' },
};

export function LanguageToggle(): React.JSX.Element {
  const { colors } = useTheme();
  const { language, setLanguage, t } = useSettings();

  return (
    <View accessibilityRole="radiogroup" style={styles.group}>
      {LANGUAGES.map((option) => {
        const selected = option === language;
        return (
          <Pressable
            key={option}
            accessibilityRole="radio"
            aria-checked={selected}
            accessibilityLabel={`${t('language.label')}: ${SEGMENTS[option].name}`}
            onPress={() => setLanguage(option)}
            style={[
              styles.segment,
              {
                borderColor: colors.primary,
                backgroundColor: selected ? colors.primary : colors.bg,
              },
            ]}
          >
            <Text
              style={[typeStyle('label', option), { color: selected ? colors.bg : colors.primary }]}
            >
              {SEGMENTS[option].text}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', marginRight: space[3] },
  segment: {
    minWidth: size.touchMin,
    minHeight: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: radius.sm,
  },
});
