import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { matchesFilters, parseFilters } from '@/features/browse/plate-filter';
import { useSettings } from '@/features/settings';
import { localized } from '@/features/species/localized';
import { getPlate, getSpeciesByPlate } from '@/shared/data/content';
import type { Language } from '@/shared/i18n/language';
import { SCREEN_PADDING, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { SpeciesRow } from '@/shared/ui/species-row';

type MessageProps = { message: string; action: string; language: Language } & (
  { href: '/browse' } | { onPress: () => void }
);

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
        <Message
          message={t('plate.notFound')}
          action={t('plate.goToBrowse')}
          href="/browse"
          language={language}
        />
      </>
    );
  }

  const heading = `${t('browse.plate', { number: plate.plate_number })} · ${localized(plate.title, language).text}`;
  const filters = parseFilters(occ);
  const species = getSpeciesByPlate(plate.plate_id).filter((s) => matchesFilters(s, filters));

  return (
    <>
      <Stack.Screen options={{ title: heading, headerTitle: heading }} />
      <FlatList
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={styles.list}
        data={species}
        keyExtractor={(item) => item.species_id}
        ListEmptyComponent={
          <Message
            message={t('plate.noMatch')}
            action={t('browse.clearFilters')}
            onPress={() => router.setParams({ occ: undefined })}
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

// Not-found links back to Browse; the filtered-empty state offers a "Clear filters" button.
function Message(props: MessageProps): React.JSX.Element {
  const { message, action, language } = props;
  const { colors } = useTheme();
  const label = (
    <Text style={[typeStyle('label', language), { color: colors.primary }]}>{action}</Text>
  );
  return (
    <View style={styles.message}>
      <Text
        accessibilityRole="header"
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {message}
      </Text>
      {'href' in props ? (
        <Link href={props.href} accessibilityRole="link" style={styles.action}>
          {label}
        </Link>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={props.onPress}
          style={[styles.action, styles.outlined, { borderColor: colors.primary }]}
        >
          {label}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: SCREEN_PADDING },
  message: { alignItems: 'flex-start', gap: space[3], padding: SCREEN_PADDING },
  action: { minHeight: size.touchMin, justifyContent: 'center' },
  outlined: { paddingHorizontal: space[3], borderWidth: 1, borderRadius: radius.pill },
});
