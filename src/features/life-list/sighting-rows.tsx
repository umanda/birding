import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { borderWidth, radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import type { Sighting } from './sighting';
import { formatSeenOn } from './sighting-date';

type Props = {
  sightings: Sighting[];
  language: Language;
  t: Translate;
  onEdit: (sighting: Sighting) => void;
  /** Resolves true when deleted. The caller announces the result. */
  onDelete: (id: string) => Promise<boolean>;
};

type Detail = { field: string; text: string };

function detailsOf(sighting: Sighting, t: Translate): Detail[] {
  const details: Detail[] = [];
  if (sighting.place_name) details.push({ field: 'place', text: sighting.place_name });
  if (sighting.zone) details.push({ field: 'zone', text: t(`identify.zone.${sighting.zone}`) });
  if (sighting.count) {
    details.push({ field: 'count', text: t('sightings.howMany', { count: sighting.count }) });
  }
  if (sighting.note) details.push({ field: 'note', text: sighting.note });
  return details;
}

/** One card per sighting. Delete asks inline first, which also works on the web. */
export function SightingRows({
  sightings,
  language,
  t,
  onEdit,
  onDelete,
}: Props): React.JSX.Element {
  const { colors } = useTheme();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const bodyStyle = [typeStyle('body', language), { color: colors.text }];

  const confirmDelete = async (id: string): Promise<void> => {
    if (await onDelete(id)) setConfirmingId(null);
  };
  const button = (text: string, label: string, onPress: () => void): React.JSX.Element => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, { borderColor: colors.primary }]}
    >
      <Text style={[typeStyle('label', language), { color: colors.text }]}>{text}</Text>
    </Pressable>
  );

  return (
    <View style={styles.list}>
      {sightings.map((sighting) => {
        const date = formatSeenOn(sighting.seen_on, t);
        return (
          <View key={sighting.id} style={[styles.row, { borderColor: colors.primary }]}>
            <Text style={[typeStyle('label', language), { color: colors.text }]}>{date}</Text>
            {detailsOf(sighting, t).map(({ field, text }) => (
              <Text key={field} style={bodyStyle}>
                {text}
              </Text>
            ))}
            {confirmingId === sighting.id ? (
              <View style={styles.actions}>
                <Text style={bodyStyle}>{t('sightings.confirm')}</Text>
                {button(
                  t('sightings.delete'),
                  t('sightings.confirmDeleteLabel', { date }),
                  () => void confirmDelete(sighting.id),
                )}
                {button(t('sightings.keep'), t('sightings.keep'), () => setConfirmingId(null))}
              </View>
            ) : (
              <View style={styles.actions}>
                {button(t('sightings.edit'), t('sightings.editLabel', { date }), () =>
                  onEdit(sighting),
                )}
                {button(t('sightings.delete'), t('sightings.deleteLabel', { date }), () =>
                  setConfirmingId(sighting.id),
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space[2] },
  row: { padding: space[3], gap: space[1], borderWidth: borderWidth.thin, borderRadius: radius.md },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space[2] },
  button: {
    minHeight: size.rowMin,
    minWidth: size.rowMin,
    paddingHorizontal: space[3],
    justifyContent: 'center',
    borderWidth: borderWidth.thin,
    borderRadius: radius.pill,
  },
});
