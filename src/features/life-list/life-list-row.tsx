import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { getSpecies } from '@/shared/data/content';
import type { Language } from '@/shared/i18n/language';
import { localized } from '@/shared/i18n/localized';
import type { Rendered } from '@/shared/i18n/localized';
import type { Translate } from '@/shared/i18n/translate';
import { size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import type { LifeListRow as Row } from './aggregate';
import { formatSeenOn } from './sighting-date';

type Props = { row: Row; language: Language; t: Translate };

export function LifeListRowItem({ row, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const species = getSpecies(row.species_id);
  // A species that left the guide keeps its row, shown by id (spec 005, ADR 0006).
  const name: Rendered = species
    ? localized(species.names, language)
    : { text: row.species_id, language: 'en' };
  const dates = {
    first: formatSeenOn(row.first_seen, t),
    last: formatSeenOn(row.last_seen, t),
    count: row.sightings,
  };

  return (
    <Link
      href={{ pathname: '/species/[id]', params: { id: row.species_id } }}
      accessibilityRole="link"
      asChild
    >
      <Pressable style={styles.row}>
        <Text style={[typeStyle('title', name.language), { color: colors.text }]}>{name.text}</Text>
        <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
          {t('lifeList.row', dates)}
        </Text>
        {row.inGuide ? null : (
          <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
            {t('lifeList.removed')}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: { gap: space[1], paddingVertical: space[3], minHeight: size.rowMin },
});
