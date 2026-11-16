import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { mediaUrl, type ManifestImage } from '@/shared/data/media';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey, Vars } from '@/shared/i18n/translate';
import { radius, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { ExternalLink } from './external-link';
import { plumageLabel } from './plumage-label';

// Reader order (spec 003), unrelated to the thumbnail rule in the media tooling.
// Morphs and any unknown key sort after these, alphabetically.
const GALLERY_PLUMAGE_ORDER = [
  'male',
  'female',
  'adult',
  'juvenile',
  'breeding',
  'non_breeding',
  'eclipse',
] as const;

function plumageRank(key: string): number {
  const index = (GALLERY_PLUMAGE_ORDER as readonly string[]).indexOf(key);
  return index === -1 ? GALLERY_PLUMAGE_ORDER.length : index;
}

function compareText(a: string, b: string): number {
  return a < b ? -1 : Number(a > b);
}

export function sortForGallery(images: readonly ManifestImage[]): ManifestImage[] {
  return [...images].sort(
    (a, b) =>
      plumageRank(a.plumage_key) - plumageRank(b.plumage_key) ||
      compareText(a.plumage_key, b.plumage_key) ||
      compareText(a.image_id, b.image_id),
  );
}

// One tab per plumage; the first image in gallery order represents it.
function firstPerPlumage(images: readonly ManifestImage[]): ManifestImage[] {
  const seen = new Set<string>();
  return sortForGallery(images).filter((image) => {
    if (seen.has(image.plumage_key)) return false;
    seen.add(image.plumage_key);
    return true;
  });
}

const SELECTED_TAB_BORDER = 3;
const SELECTED_TAB_WEIGHT = '700';

type Translate = (key: MessageKey, vars?: Vars) => string;
type Props = {
  images: readonly ManifestImage[];
  speciesName: string;
  language: Language;
  t: Translate;
};
type CreditProps = { credit: ManifestImage['credit']; language: Language; t: Translate };

export function PhotoCredit({ credit, language, t }: CreditProps): React.JSX.Element {
  const { colors } = useTheme();
  const { author, licence, licence_url: licenceUrl, source_url: sourceUrl } = credit;
  const label = typeStyle('caption', language);
  return (
    <View style={styles.credit}>
      <Text style={[label, { color: colors.textMuted }]}>
        {credit.attribution ?? t('gallery.photoBy', { author: author ?? t('common.notRecorded') })}
      </Text>
      {licenceUrl ? (
        <ExternalLink
          url={licenceUrl}
          {...(licence ? { label: licence } : {})}
          language={language}
          t={t}
        />
      ) : null}
      {licence && !licenceUrl ? (
        <Text style={[label, { color: colors.textMuted }]}>{licence}</Text>
      ) : null}
      {sourceUrl ? <ExternalLink url={sourceUrl} language={language} t={t} /> : null}
      {credit.replace_before_launch ? (
        <Text style={[label, { color: colors.error }]}>{t('gallery.noncommercial')}</Text>
      ) : null}
    </View>
  );
}

function NotDownloaded({ language, t }: { language: Language; t: Translate }): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <View style={[styles.empty, { backgroundColor: colors.surface }]}>
      <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
        {t('gallery.notDownloaded')}
      </Text>
    </View>
  );
}

function Tab(props: {
  label: string;
  selected: boolean;
  onPress: () => void;
  language: Language;
}): React.JSX.Element {
  const { colors } = useTheme();
  const { label, selected, onPress, language } = props;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      aria-selected={selected}
      onPress={onPress}
      style={[
        styles.tab,
        { backgroundColor: selected ? colors.primary : colors.surface },
        selected && { borderBottomWidth: SELECTED_TAB_BORDER, borderBottomColor: colors.focus },
      ]}
    >
      <Text
        style={[
          typeStyle('label', language),
          { color: selected ? colors.badgeText : colors.text },
          selected && { fontWeight: SELECTED_TAB_WEIGHT, textDecorationLine: 'underline' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SpeciesGallery({
  images: unsorted,
  speciesName,
  language,
  t,
}: Props): React.JSX.Element {
  const { colors } = useTheme();
  const images = firstPerPlumage(unsorted);
  const [selectedId, setSelectedId] = useState(images[0]?.image_id);
  const [failedIds, setFailedIds] = useState<string[]>([]);
  const [failedThumbIds, setFailedThumbIds] = useState<string[]>([]);

  const image = images.find((i) => i.image_id === selectedId) ?? images[0];
  if (!image) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.surface }]}>
        <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>
          {t('gallery.noPhoto')}
        </Text>
      </View>
    );
  }

  const failed = failedIds.includes(image.image_id);
  // The thumbnail is safe offline because it is precached. It must show the selected plumage.
  const thumbSource = unsorted.find((i) => i.thumb && i.plumage_key === image.plumage_key);
  const showThumb = failed && thumbSource?.thumb && !failedThumbIds.includes(thumbSource.image_id);
  const shown = showThumb && thumbSource ? thumbSource : image;
  const plumage = plumageLabel(shown.plumage_key, t);
  const author = shown.credit.author ?? t('common.notRecorded');
  const alt = t('gallery.alt', { name: speciesName, plumage, author });

  return (
    <View style={styles.gallery}>
      <View
        accessibilityRole="tablist"
        accessibilityLabel={t('gallery.plumageTabs')}
        style={styles.tabs}
      >
        {images.map((i) => (
          <Tab
            key={i.image_id}
            label={plumageLabel(i.plumage_key, t)}
            selected={i.image_id === image.image_id}
            onPress={() => setSelectedId(i.image_id)}
            language={language}
          />
        ))}
      </View>
      {failed ? (
        showThumb && thumbSource?.thumb ? (
          <Image
            source={{ uri: mediaUrl(thumbSource.thumb.path) }}
            accessibilityLabel={alt}
            resizeMode="contain"
            onError={() => setFailedThumbIds((ids) => [...ids, thumbSource.image_id])}
            style={[styles.photo, { aspectRatio: shown.width / shown.height }]}
          />
        ) : (
          <NotDownloaded language={language} t={t} />
        )
      ) : (
        <Image
          source={{ uri: mediaUrl(image.full.path) }}
          accessibilityLabel={alt}
          resizeMode="contain"
          onError={() => setFailedIds((ids) => [...ids, image.image_id])}
          style={[styles.photo, { aspectRatio: image.width / image.height }]}
        />
      )}
      <PhotoCredit credit={shown.credit} language={language} t={t} />
    </View>
  );
}

const styles = StyleSheet.create({
  gallery: { gap: space[2] },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  tab: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space[3],
    borderRadius: radius.pill,
  },
  photo: { width: '100%', borderRadius: radius.md },
  empty: { padding: space[4], borderRadius: radius.md, alignItems: 'center' },
  credit: { gap: space[1] },
});
