import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { getSpecies } from '@/shared/data/content';
import { getSpeciesImages, mediaUrl } from '@/shared/data/media';
import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { radius, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { SpeciesRow } from '@/shared/ui/species-row';

import { flagParts, whyParts } from './results-model';
import type { RankedSpecies } from './types';

const THUMB_SIZE = 72;

function Thumb({ speciesId, language, t }: ThumbProps): React.JSX.Element {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const thumb = getSpeciesImages(speciesId).find((image) => image.primary)?.thumb;
  if (!thumb || failed) {
    return (
      // Decorative: the row text already names the bird.
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.thumb, styles.noPhoto, { backgroundColor: colors.surface }]}
      >
        <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
          {t('gallery.noPhoto')}
        </Text>
      </View>
    );
  }
  // The row text already names the bird, so the photo is decorative.
  return (
    <Image
      source={{ uri: mediaUrl(thumb.path) }}
      alt=""
      testID="result-thumb"
      onError={() => setFailed(true)}
      style={styles.thumb}
    />
  );
}
type ThumbProps = { speciesId: string; language: Language; t: Translate };

type Props = { result: RankedSpecies; language: Language; t: Translate };

export function ResultRow({ result, language, t }: Props): React.JSX.Element | null {
  const { colors } = useTheme();
  const species = getSpecies(result.species_id);
  if (!species) return null;
  const parts = whyParts(result.reasons, t);
  const spoken = parts.map((part) => part.spoken).join('. ');
  return (
    <Link href={{ pathname: '/species/[id]', params: { id: species.species_id } }} push asChild>
      <Pressable accessibilityRole="link" style={styles.row}>
        <Thumb speciesId={species.species_id} language={language} t={t} />
        <View style={styles.text}>
          <SpeciesRow species={species} language={language} t={t} />
          {parts.length > 0 ? (
            <Text
              accessibilityLabel={spoken}
              style={[typeStyle('body', language), { color: colors.text }]}
            >
              {parts.map((part, index) => (
                <Text key={part.label}>
                  {index > 0 ? ' · ' : ''}
                  {part.label} <Text aria-hidden>{part.glyph}</Text>
                </Text>
              ))}
            </Text>
          ) : null}
          {flagParts(result.flags, t).map(({ glyph, label }) => (
            <Text
              key={label}
              accessibilityLabel={label}
              style={[typeStyle('body', language), { color: colors.text }]}
            >
              <Text aria-hidden>{`${glyph} `}</Text>
              {label}
            </Text>
          ))}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space[3], alignItems: 'flex-start' },
  text: { flex: 1, gap: space[1] },
  thumb: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: radius.md },
  noPhoto: { alignItems: 'center', justifyContent: 'center', padding: space[1] },
});
