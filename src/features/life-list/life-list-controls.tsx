import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { OccurrenceFilter } from '@/shared/data/content';
import { OCCURRENCE_FILTERS } from '@/shared/data/occurrence-filter';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey, Translate } from '@/shared/i18n/translate';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { appearanceOf } from '@/shared/ui/occurrence-badge';

import type { LifeListSort } from './aggregate';

type Props = {
  sort: LifeListSort;
  filters: readonly OccurrenceFilter[];
  onSort: (sort: LifeListSort) => void;
  onToggleFilter: (filter: OccurrenceFilter) => void;
  language: Language;
  t: Translate;
};

const SORTS: readonly { value: LifeListSort; labelKey: MessageKey }[] = [
  { value: 'recent', labelKey: 'lifeList.sort.recent' },
  { value: 'name', labelKey: 'lifeList.sort.name' },
  { value: 'plate', labelKey: 'lifeList.sort.plate' },
];

export function LifeListControls(props: Props): React.JSX.Element {
  const { sort, filters, onSort, onToggleFilter, language, t } = props;
  const { colors } = useTheme();
  const chip = (selected: boolean) => [
    styles.chip,
    { borderColor: colors.primary, backgroundColor: selected ? colors.primary : colors.bg },
  ];
  const chipText = (selected: boolean) => [
    typeStyle('label', language),
    { color: selected ? colors.badgeText : colors.text },
  ];

  return (
    <View style={styles.controls}>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t('lifeList.sort')}
        style={styles.row}
      >
        {SORTS.map(({ value, labelKey }) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityLabel={t(labelKey)}
            accessibilityState={{ checked: sort === value }}
            onPress={() => onSort(value)}
            style={chip(sort === value)}
          >
            <Text style={chipText(sort === value)}>{t(labelKey)}</Text>
          </Pressable>
        ))}
      </View>
      <View accessibilityRole="toolbar" accessibilityLabel={t('browse.filters')} style={styles.row}>
        {OCCURRENCE_FILTERS.map((filter) => {
          const { shape, wordKey } = appearanceOf(filter);
          const selected = filters.includes(filter);
          return (
            <Pressable
              key={filter}
              accessibilityRole="checkbox"
              aria-checked={selected}
              accessibilityLabel={t(wordKey)}
              onPress={() => onToggleFilter(filter)}
              style={chip(selected)}
            >
              <Text style={chipText(selected)}>{`${shape} ${filter} ${t(wordKey)}`}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: { gap: space[2] },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  chip: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space[3],
    borderWidth: 1,
    borderRadius: radius.pill,
  },
});
