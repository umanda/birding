import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getPlate, getSpeciesByPlate } from '@/shared/data/content';
import { matchesFilters, parseFilters } from '@/shared/data/occurrence-filter';
import type { Language } from '@/shared/i18n/language';
import { localized } from '@/shared/i18n/localized';
import { SCREEN_PADDING, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { SpeciesRow } from '@/shared/ui/species-row';

type MessageProps = { message: string; language: Language };

export function PlateRoute(): React.JSX.Element {
  const { id, occ } = useLocalSearchParams<{ id?: string | string[]; occ?: string | string[] }>();
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const router = useRouter();
  const plate = typeof id === 'string' ? getPlate(id) : undefined;

  if (!plate) {
    return (
      <>
        <Stack.Screen options={{ title: t('plate.notFound'), headerTitle: '' }} />
        <NotFound
          message={t('plate.notFound')}
          action={t('plate.goToBrowse')}
          language={language}
        />
      </>
    );
  }

  const title = localized(plate.title, language);
  const heading = `${t('browse.plate', { number: plate.plate_number })} · ${title.text}`;
  const filters = parseFilters(occ);
  const species = getSpeciesByPlate(plate.plate_id).filter((s) => matchesFilters(s, filters));

  // The on-page heading is the one h1, so the header shows only the back button.
  return (
    <>
      <Stack.Screen options={{ title: heading, headerTitle: '' }} />
      <FlatList
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={styles.list}
        data={species}
        keyExtractor={(item) => item.species_id}
        ListHeaderComponent={
          <Text
            accessibilityRole="header"
            style={[typeStyle('title', title.language), { color: colors.text }]}
          >
            {heading}
          </Text>
        }
        ListEmptyComponent={
          <NoMatch
            message={t('plate.noMatch')}
            action={t('browse.clearFilters')}
            onClear={() => router.setParams({ occ: undefined })}
            language={language}
          />
        }
        renderItem={({ item }) => (
          <Link href={{ pathname: '/species/[id]', params: { id: item.species_id } }} asChild>
            <Pressable accessibilityRole="link">
              <SpeciesRow species={item} language={language} t={t} />
            </Pressable>
          </Link>
        )}
      />
    </>
  );
}

function NotFound({
  message,
  action,
  language,
}: MessageProps & { action: string }): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={styles.message}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {message}
      </Text>
      <Link href="/browse" asChild>
        <Pressable accessibilityRole="link" style={styles.action}>
          <Text style={[typeStyle('label', language), { color: colors.primary }]}>{action}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function NoMatch({
  message,
  action,
  onClear,
  language,
}: MessageProps & { action: string; onClear: () => void }): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={styles.message}>
      <Text style={[typeStyle('body', language), { color: colors.text }]}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onClear}
        style={[styles.action, styles.outlined, { borderColor: colors.primary }]}
      >
        <Text style={[typeStyle('label', language), { color: colors.primary }]}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: SCREEN_PADDING },
  message: { alignItems: 'flex-start', gap: space[3], paddingVertical: space[4] },
  action: { minHeight: size.touchMin, justifyContent: 'center' },
  outlined: { paddingHorizontal: space[3], borderWidth: 1, borderRadius: radius.pill },
});
