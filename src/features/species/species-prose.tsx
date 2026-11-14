import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TextProps } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { MessageKey, Vars } from '@/shared/i18n/translate';
import { getSpeciesText } from '@/shared/data/species-text';
import type { SpeciesText } from '@/shared/data/species-text';
import type { TextField } from '@/shared/data/species-text-schema';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

type Translate = (key: MessageKey, vars?: Vars) => string;
type ProseProps = { speciesId: string; language: Language; t: Translate };
type LoadState =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; text: SpeciesText | undefined };

const SECTIONS: readonly { field: TextField; title: MessageKey }[] = [
  { field: 'species_description', title: 'species.section.description' },
  { field: 'male_female_identification', title: 'species.section.maleFemale' },
  { field: 'juvenile_immature_plumage', title: 'species.section.juvenile' },
  { field: 'field_spotting_tips', title: 'species.section.fieldTips' },
  { field: 'sri_lanka_distribution_and_hotspots', title: 'species.section.distribution' },
  { field: 'seasonality_months_seen', title: 'species.section.seasonality' },
];

// Callers key the component by species id, so a new species starts again from loading.
function useSpeciesText(speciesId: string): LoadState {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  useEffect(() => {
    let cancelled = false;
    getSpeciesText(speciesId).then(
      (text) => !cancelled && setState({ status: 'ready', text }),
      () => !cancelled && setState({ status: 'error' }),
    );
    return () => {
      cancelled = true;
    };
  }, [speciesId]);
  return state;
}

export function SpeciesProse({ speciesId, language, t }: ProseProps): React.JSX.Element {
  const { colors } = useTheme();
  const state = useSpeciesText(speciesId);

  if (state.status !== 'ready') {
    const message = state.status === 'error' ? t('species.text.error') : t('species.text.loading');
    return (
      <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>{message}</Text>
    );
  }
  return (
    <View style={styles.sections}>
      {SECTIONS.map(({ field, title }) => (
        <Section
          key={field}
          title={t(title)}
          value={state.text?.[field] ?? null}
          language={language}
          t={t}
        />
      ))}
    </View>
  );
}

type SectionProps = {
  title: string;
  value: SpeciesText[TextField];
  language: Language;
  t: Translate;
};

// A text keeps its own language: that picks the font, the `lang` tag and the notice.
function Section({ title, value, language, t }: SectionProps): React.JSX.Element {
  const { colors } = useTheme();
  const showNotice = value !== null && value.lang !== language;
  return (
    <View style={styles.section}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {title}
      </Text>
      {showNotice ? (
        <Text style={[typeStyle('label', language), { color: colors.textMuted }]}>
          {t('species.text.notInLanguage', { language: t(`language.name.${language}`) })}
        </Text>
      ) : null}
      <Text
        {...langProps(value?.lang ?? language)}
        style={[typeStyle('body', value?.lang ?? language), { color: colors.text }]}
      >
        {value?.text ?? t('common.notRecorded')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sections: { gap: space[4] },
  section: { gap: space[1] },
});

// react-native-web renders `lang` as the HTML attribute; the native Text type does not declare it.
const langProps = (lang: Language): TextProps => ({ lang }) as TextProps;
