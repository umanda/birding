import { StyleSheet, Text, View } from 'react-native';

import type { SpeciesSource } from '@/shared/data/species-text-schema';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey, Vars } from '@/shared/i18n/translate';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { ExternalLink } from './external-link';
import { headingProps, langProps, SECTION_HEADING_LEVEL } from './text-props';

type Props = {
  sources: SpeciesSource[];
  language: Language;
  t: (key: MessageKey, vars?: Vars) => string;
};

// Every source carries the same note today; shown once, and once per distinct value if that changes.
function distinctNotes(sources: SpeciesSource[]): string[] {
  const notes = sources.map((source) => source.verification_note);
  return [...new Set(notes.filter((note): note is string => note !== null))];
}

export function SpeciesSources({ sources, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        accessibilityRole="header"
        {...headingProps(SECTION_HEADING_LEVEL)}
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {t('species.section.sources')}
      </Text>
      {sources.length === 0 ? (
        <Text style={[typeStyle('body', language), { color: colors.text }]}>
          {t('common.notRecorded')}
        </Text>
      ) : null}
      {distinctNotes(sources).map((note) => (
        <Text key={note} style={[typeStyle('label', language), { color: colors.textMuted }]}>
          {t('species.sources.verification', { note })}
        </Text>
      ))}
      {sources.map((source) => (
        <View key={source.source_id} style={styles.section}>
          <Text {...langProps('en')} style={[typeStyle('body', 'en'), { color: colors.text }]}>
            {source.citation}
          </Text>
          {source.links.map((url) => (
            <ExternalLink key={url} url={url} language={language} t={t} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ section: { gap: space[1] } });
