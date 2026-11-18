import { Link } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllSpecies } from '@/shared/data/content';
import { SCREEN_PADDING, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { lifeListRows, lifeListSummary } from './aggregate';
import { useLifeList } from './life-list-context';
import { LifeListRowItem } from './life-list-row';
import { LifeListSummaryCard } from './life-list-summary';

const NO_FILTERS: [] = [];

export function LifeListScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const { status, sightings } = useLifeList();
  const rows = useMemo(
    () =>
      lifeListRows(sightings, getAllSpecies(), { sort: 'recent', filters: NO_FILTERS, language }),
    [sightings, language],
  );
  const summary = useMemo(() => lifeListSummary(sightings, getAllSpecies()), [sightings]);
  const body = [typeStyle('body', language), { color: colors.text }];

  if (status === 'loading') {
    return (
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <Text style={body}>{t('lifeList.loading')}</Text>
      </View>
    );
  }

  const empty = (
    <View style={styles.empty}>
      <Text style={body}>{t('lifeList.empty')}</Text>
      <Link href="/" asChild>
        <Pressable style={styles.link}>
          <Text style={[typeStyle('label', language), { color: colors.primary }]}>
            {t('tabs.identify')}
          </Text>
        </Pressable>
      </Link>
      <Link href="/search" asChild>
        <Pressable style={styles.link}>
          <Text style={[typeStyle('label', language), { color: colors.primary }]}>
            {t('tabs.search')}
          </Text>
        </Pressable>
      </Link>
    </View>
  );

  const header = (
    <View style={styles.header}>
      <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
        {t('lifeList.savedHere')}
      </Text>
      {rows.length ? <LifeListSummaryCard summary={summary} language={language} t={t} /> : null}
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={styles.screen}
      data={rows}
      keyExtractor={(row) => row.species_id}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      renderItem={({ item }) => <LifeListRowItem row={item} language={language} t={t} />}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, padding: SCREEN_PADDING },
  header: { gap: space[3], paddingBottom: space[3] },
  empty: { gap: space[2], paddingVertical: space[4] },
  link: { minHeight: size.touchMin, justifyContent: 'center' },
});
