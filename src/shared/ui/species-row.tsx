import { StyleSheet, Text, View } from 'react-native';

import type { Species } from '@/shared/data/content-schema';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { fontStyle } from '@/shared/theme/fonts';
import { space } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/use-theme';

import { OccurrenceBadge } from './occurrence-badge';

type Props = { species: Species; language: Language; t: (key: MessageKey) => string };

// A blank Sinhala name stays blank in the data; only the primary line falls back to English.
export function SpeciesRow({ species, language, t }: Props) {
  const { colors } = useTheme();
  const { en, si, scientific } = species.names;
  const names = { en, si };
  const other: Language = language === 'si' ? 'en' : 'si';
  const primary = names[language] ?? en;
  const otherName = names[other];
  const secondary = otherName === primary ? null : otherName;

  return (
    <View style={styles.row}>
      <Text style={[fontStyle(language, 600), styles.primary, { color: colors.text }]}>
        {primary}
      </Text>
      {secondary ? (
        <Text style={[fontStyle(other, 400), { color: colors.textMuted }]}>{secondary}</Text>
      ) : null}
      <Text style={{ color: colors.textMuted }}>{scientific}</Text>
      <OccurrenceBadge code={species.occurrence_code} t={t} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: space[1], paddingVertical: space[3], minHeight: 56 },
  primary: { fontSize: 16 },
});
