import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import type { Species } from '@/shared/data/content-schema';
import { getPlate, getSpecies } from '@/shared/data/content';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey } from '@/shared/i18n/translate';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { IucnBadge } from '@/shared/ui/iucn-badge';
import { OccurrenceBadge } from '@/shared/ui/occurrence-badge';

type Translate = (key: MessageKey) => string;
type DetailProps = { species: Species; language: Language; t: Translate };

export function SpeciesRoute(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, t } = useSettings();
  const species = getSpecies(id);
  const title = species ? (species.names[language] ?? species.names.en) : t('species.notFound');

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title }} />
      {species ? (
        <SpeciesDetail species={species} language={language} t={t} />
      ) : (
        <NotFound language={language} message={title} />
      )}
    </>
  );
}

function NotFound({
  language,
  message,
}: {
  language: Language;
  message: string;
}): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {message}
      </Text>
    </View>
  );
}

// Blank values stay blank in the data; the screen says "Not recorded" instead of hiding them.
export function SpeciesDetail({ species, language, t }: DetailProps): React.JSX.Element {
  const { colors } = useTheme();
  const { en, si, scientific } = species.names;
  const names = { en, si };
  const other: Language = language === 'si' ? 'en' : 'si';
  const primary = names[language] ?? en;
  const plateTitle = getPlate(species.plate_id)?.title;
  const plateName = plateTitle ? (plateTitle[language] ?? plateTitle.en) : null;
  const notRecorded = t('common.notRecorded');

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('display', language), { color: colors.text }]}
      >
        {primary}
      </Text>
      <Text style={[typeStyle('body', other), { color: colors.textMuted }]}>
        {names[other] ?? notRecorded}
      </Text>
      <Text style={[typeStyle('body', 'en'), styles.scientific, { color: colors.textMuted }]}>
        {scientific}
      </Text>
      <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
        {plateName ?? notRecorded}
      </Text>
      <View style={styles.badges}>
        <OccurrenceBadge code={species.occurrence_code} language={language} t={t} />
        {species.iucn_category ? (
          <IucnBadge category={species.iucn_category} language={language} t={t} />
        ) : (
          <Text style={[typeStyle('label', language), { color: colors.textMuted }]}>
            {`${t('iucn.label')}: ${notRecorded}`}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: space[4], gap: space[2] },
  scientific: { fontStyle: 'italic' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[2] },
});
