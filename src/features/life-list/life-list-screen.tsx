import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllSpecies } from '@/shared/data/content';
import type { OccurrenceFilter } from '@/shared/data/content';
import { SCREEN_PADDING, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { lifeListRows, lifeListSummary } from './aggregate';
import type { LifeListSort } from './aggregate';
import { useLifeList } from './life-list-context';
import { LifeListControls } from './life-list-controls';
import { LifeListRowItem } from './life-list-row';
import { LifeListSummaryCard } from './life-list-summary';

export function LifeListScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const { status, sightings } = useLifeList();
  const [sort, setSort] = useState<LifeListSort>('recent');
  const [filters, setFilters] = useState<OccurrenceFilter[]>([]);
  const rows = useMemo(
    () => lifeListRows(sightings, getAllSpecies(), { sort, filters, language }),
    [sightings, sort, filters, language],
  );
  const toggleFilter = (filter: OccurrenceFilter): void =>
    setFilters((current) =>
      current.includes(filter) ? current.filter((f) => f !== filter) : [...current, filter],
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

  const noSightings = sightings.length === 0;
  const empty = noSightings ? (
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
  ) : (
    <View style={styles.empty}>
      <Text style={body}>{t('lifeList.noMatch')}</Text>
      <Pressable accessibilityRole="button" onPress={() => setFilters([])} style={styles.link}>
        <Text style={[typeStyle('label', language), { color: colors.primary }]}>
          {t('browse.clearFilters')}
        </Text>
      </Pressable>
    </View>
  );

  const header = (
    <View style={styles.header}>
      <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
        {t('lifeList.savedHere')}
      </Text>
      {noSightings ? null : (
        <>
          <LifeListSummaryCard summary={summary} language={language} t={t} />
          <LifeListControls
            sort={sort}
            filters={filters}
            onSort={setSort}
            onToggleFilter={toggleFilter}
            language={language}
            t={t}
          />
        </>
      )}
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
