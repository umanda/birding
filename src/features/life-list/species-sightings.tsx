import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { getContentVersion } from '@/shared/data/content';
import type { Language } from '@/shared/i18n/language';
import type { Rendered } from '@/shared/i18n/localized';
import type { Translate } from '@/shared/i18n/translate';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { useLifeList } from './life-list-context';
import type { CleanFields } from './sighting';
import { formatSeenOn } from './sighting-date';
import { SightingSheet } from './sighting-sheet';

const DISABLED_OPACITY = 0.5; // same value as sighting-sheet; no opacity token yet

type Message = { text: string; id: number };
type Props = { speciesId: string; name: Rendered; language: Language; t: Translate };

/** "I saw this" button and the times-seen summary for one species. */
export function SpeciesSightings({ speciesId, name, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const { status, sightings, add } = useLifeList();
  const [adding, setAdding] = useState(false);
  // The id changes on every message so a repeated text is announced again.
  const [message, setMessage] = useState<Message>({ text: '', id: 0 });
  const mine = sightings.filter((sighting) => sighting.species_id === speciesId);
  const newest = mine[0]; // the provider returns newest first
  const addLabel = t(newest ? 'sightings.addAnother' : 'sightings.add');
  const ready = status === 'ready';

  // iOS ignores accessibilityLiveRegion, so it needs an explicit announcement.
  useEffect(() => {
    if (message.text && Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- announce per message, not per text
  }, [message.id]);
  const say = (text: string): void => setMessage((previous) => ({ text, id: previous.id + 1 }));

  const save = async (fields: CleanFields): Promise<void> => {
    await add({ ...fields, species_id: speciesId, content_version: getContentVersion() });
    setAdding(false); // only on success; a throw keeps the sheet open with Retry
    say(t('sightings.saved'));
  };

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={addLabel}
        accessibilityState={{ disabled: !ready }}
        disabled={!ready}
        onPress={() => setAdding(true)}
        style={[
          styles.button,
          { backgroundColor: colors.primary, opacity: ready ? 1 : DISABLED_OPACITY },
        ]}
      >
        <Text style={[typeStyle('label', language), { color: colors.badgeText }]}>{addLabel}</Text>
      </Pressable>
      {newest ? (
        <Text style={[typeStyle('body', language), { color: colors.text }]}>
          {t('sightings.seen', { count: mine.length, date: formatSeenOn(newest.seen_on, t) })}
        </Text>
      ) : null}
      <View accessibilityLiveRegion="polite">
        {message.text ? (
          <Text key={message.id} style={[typeStyle('body', language), { color: colors.text }]}>
            {message.text}
          </Text>
        ) : null}
      </View>
      {adding ? (
        <SightingSheet
          name={name}
          language={language}
          t={t}
          onSave={save}
          onCancel={() => setAdding(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space[2] },
  button: {
    minHeight: size.rowMin,
    paddingHorizontal: space[4],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.pill,
  },
});
