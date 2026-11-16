import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllSpecies } from '@/shared/data/content';
import { getAllImages, type ManifestImage } from '@/shared/data/media';
import type { Language } from '@/shared/i18n/language';
import { localized } from '@/shared/i18n/localized';
import type { Translate } from '@/shared/i18n/translate';
import { plumageLabel, sortForGallery } from '@/shared/media/plumage';
import { SCREEN_PADDING, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { PhotoCredit } from '@/shared/ui/photo-credit';
import { headingProps, langProps, SECTION_HEADING_LEVEL } from '@/shared/ui/text-props';

type ListProps = { images: readonly ManifestImage[]; language: Language; t: Translate };

export function PhotoCreditsScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  return (
    <>
      <Stack.Screen options={{ title: t('credits.title') }} />
      <PhotoCreditsList images={getAllImages()} language={language} t={t} />
    </>
  );
}

// Species in content order, so the list reads like the plates; images in gallery order.
export function PhotoCreditsList({ images, language, t }: ListProps): React.JSX.Element {
  const { colors } = useTheme();
  const groups = getAllSpecies()
    .map((species) => ({
      species,
      images: sortForGallery(images.filter((i) => i.species_id === species.species_id)),
    }))
    .filter((group) => group.images.length > 0);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.content}>
      {groups.length === 0 ? (
        <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
          {t('credits.empty')}
        </Text>
      ) : null}
      {groups.map(({ species, images: speciesImages }) => {
        const name = localized(species.names, language);
        return (
          <View key={species.species_id} accessibilityLabel={name.text} style={styles.group}>
            <Text
              accessibilityRole="header"
              {...headingProps(SECTION_HEADING_LEVEL)}
              {...langProps(name.language)}
              style={[typeStyle('title', name.language), { color: colors.text }]}
            >
              {name.text}
            </Text>
            {speciesImages.map((image) => (
              <View key={image.image_id} style={styles.image}>
                <Text style={[typeStyle('label', language), { color: colors.text }]}>
                  {plumageLabel(image.plumage_key, t)}
                </Text>
                <PhotoCredit credit={image.credit} language={language} t={t} />
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: SCREEN_PADDING, gap: space[4] },
  group: { gap: space[2] },
  image: { gap: space[1] },
});
