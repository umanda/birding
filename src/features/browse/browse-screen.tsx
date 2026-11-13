import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllSpecies, getPlates, getSpeciesByPlate } from '@/shared/data/content';
import type { OccurrenceFilter } from '@/shared/data/content';
import { SCREEN_PADDING, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { SINGLE_APPEARANCE } from '@/shared/ui/occurrence-badge';

import {
  OCCURRENCE_FILTERS,
  buildPlateRows,
  countByFilter,
  parseFilters,
  serializeFilters,
  toggleFilter,
} from './plate-filter';

const FILTER_COUNTS = countByFilter(getAllSpecies());

// Rows do not navigate yet: plate/[id] arrives in slice 8, which will wrap them in a link.
export function BrowseScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const router = useRouter();
  const { occ } = useLocalSearchParams<{ occ?: string }>();
  const filters = parseFilters(occ);
  const rows = buildPlateRows(getPlates(), getSpeciesByPlate, filters);
  const setFilters = (next: OccurrenceFilter[]): void =>
    router.setParams({ occ: serializeFilters(next) });

  const header = (
    <View accessibilityRole="toolbar" accessibilityLabel={t('browse.filters')} style={styles.chips}>
      {OCCURRENCE_FILTERS.map((filter) => {
        const { shape, wordKey } = SINGLE_APPEARANCE[filter];
        const selected = filters.includes(filter);
        const label = `${shape} ${filter} ${t(wordKey)} ${FILTER_COUNTS[filter]}`;
        return (
          <Pressable
            key={filter}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={label}
            onPress={() => setFilters(toggleFilter(filters, filter))}
            style={[
              styles.chip,
              {
                borderColor: colors.primary,
                backgroundColor: selected ? colors.primary : colors.bg,
              },
            ]}
          >
            <Text
              style={[
                typeStyle('label', language),
                { color: selected ? colors.badgeText : colors.text },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const empty = (
    <View style={styles.empty}>
      <Text style={[typeStyle('body', language), { color: colors.text }]}>
        {t('browse.noMatch')}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setFilters([])}
        style={[styles.chip, { borderColor: colors.primary }]}
      >
        <Text style={[typeStyle('label', language), { color: colors.primary }]}>
          {t('browse.clearFilters')}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={styles.list}
      data={rows}
      keyExtractor={({ plate }) => plate.plate_id}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      renderItem={({ item: { plate, count } }) => (
        <View style={styles.row}>
          <Text style={[typeStyle('title', language), { color: colors.text }]}>
            {`${t('browse.plate', { number: plate.plate_number })} · ${plate.title[language] ?? plate.title.en}`}
          </Text>
          <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
            {t('browse.species', { count })}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: SCREEN_PADDING },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2], paddingBottom: space[3] },
  chip: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  row: { gap: space[1], paddingVertical: space[3], minHeight: size.rowMin },
  empty: { alignItems: 'flex-start', gap: space[3], paddingVertical: space[4] },
});
