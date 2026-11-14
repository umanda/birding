import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getPlate, getSpecies } from '@/shared/data/content';
import type { Species } from '@/shared/data/content-schema';
import type { Language } from '@/shared/i18n/language';
import { localized, otherLanguage } from '@/shared/i18n/localized';
import type { MessageKey } from '@/shared/i18n/translate';
import { size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { IucnBadge } from '@/shared/ui/iucn-badge';
import { OccurrenceBadge } from '@/shared/ui/occurrence-badge';

import { SpeciesProse } from './species-prose';

// The static export's `species/[id].html` template is built with the literal route pattern as id.
const TEMPLATE_ID = '[id]';

type Translate = (key: MessageKey) => string;
type DetailProps = { species: Species; language: Language; t: Translate };

export function SpeciesRoute(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { language, t } = useSettings();
  const { colors } = useTheme();
  if (id === TEMPLATE_ID) return <View style={[styles.screen, { backgroundColor: colors.bg }]} />;

  const species = typeof id === 'string' ? getSpecies(id) : undefined;
  const title = species ? localized(species.names, language).text : t('species.notFound');

  // The on-page heading is the one h1, so the header shows only the back button.
  return (
    <>
      <Stack.Screen options={{ title, headerTitle: '' }} />
      {species ? (
        <SpeciesDetail species={species} language={language} t={t} />
      ) : (
        <NotFound language={language} t={t} />
      )}
    </>
  );
}

function NotFound({ language, t }: { language: Language; t: Translate }): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {t('species.notFound')}
      </Text>
      <Link href="/search" accessibilityRole="link" style={styles.link}>
        <Text style={[typeStyle('body', language), { color: colors.primary }]}>
          {t('species.goToSearch')}
        </Text>
      </Link>
    </View>
  );
}

// Blank values stay blank in the data; the screen says "Not recorded" instead of hiding them.
export function SpeciesDetail({ species, language, t }: DetailProps): React.JSX.Element {
  const { colors } = useTheme();
  const notRecorded = t('common.notRecorded');
  const primary = localized(species.names, language);
  const other = otherLanguage(language);
  const otherName = species.names[other];
  const plate = getPlate(species.plate_id);
  const plateName = plate ? localized(plate.title, language) : null;
  const muted = { color: colors.textMuted };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('display', primary.language), { color: colors.text }]}
      >
        {primary.text}
      </Text>
      <Text style={[typeStyle('body', otherName ? other : language), muted]}>
        {otherName ?? notRecorded}
      </Text>
      <Text style={[typeStyle('body', 'en'), styles.scientific, muted]}>
        {species.names.scientific}
      </Text>
      <Text style={[typeStyle('body', plateName?.language ?? language), muted]}>
        {plateName?.text ?? notRecorded}
      </Text>
      <View style={styles.badges}>
        <OccurrenceBadge code={species.occurrence_code} language={language} t={t} />
        {species.iucn_category ? (
          <IucnBadge category={species.iucn_category} language={language} t={t} />
        ) : (
          <Text style={[typeStyle('label', language), muted]}>
            {`${t('iucn.label')}: ${notRecorded}`}
          </Text>
        )}
      </View>
      <SpeciesProse
        key={species.species_id}
        speciesId={species.species_id}
        language={language}
        t={t}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: space[4], gap: space[2] },
  content: { padding: space[4], gap: space[2] },
  scientific: { fontStyle: 'italic' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[2] },
  link: { minHeight: size.touchMin, justifyContent: 'center' },
});
