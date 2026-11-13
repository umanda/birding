import { StyleSheet, Text, View } from 'react-native';

import type { Species } from '@/shared/data/content-schema';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { OccurrenceBadge } from './occurrence-badge';

type Props = { species: Species; language: Language; t: (key: MessageKey) => string };

// A blank Sinhala name stays blank in the data; only the primary line falls back to English.
export function SpeciesRow({ species, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const { en, si, scientific } = species.names;
  const names = { en, si };
  const other: Language = language === 'si' ? 'en' : 'si';
  const primary = names[language] ?? en;
  const otherName = names[other];
  const secondary = otherName === primary ? null : otherName;

  return (
    <View style={styles.row}>
      <Text style={[typeStyle('title', language), { color: colors.text }]}>{primary}</Text>
      {secondary ? (
        <Text style={[typeStyle('body', other), { color: colors.textMuted }]}>{secondary}</Text>
      ) : null}
      <Text style={[typeStyle('body', 'en'), styles.scientific, { color: colors.textMuted }]}>
        {scientific}
      </Text>
      <OccurrenceBadge code={species.occurrence_code} language={language} t={t} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: space[1], paddingVertical: space[3], minHeight: size.rowMin },
  scientific: { fontStyle: 'italic' },
});
