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

function Credit({ credit, language, t }: CreditProps): React.JSX.Element {
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

type FallbackProps = {
  thumb: ManifestImage['thumb'];
  alt: string;
  language: Language;
  t: Translate;
};

function OfflineFallback({ thumb, alt, language, t }: FallbackProps): React.JSX.Element {
  const { colors } = useTheme();
  const message = thumb ? t('gallery.notDownloaded') : t('gallery.unavailable');
  return (
    <View style={[styles.empty, { backgroundColor: colors.surface }]}>
      {thumb ? (
        <Image
          source={{ uri: mediaUrl(thumb.path) }}
          accessibilityLabel={alt}
          resizeMode="contain"
          style={styles.thumb}
        />
      ) : null}
      <Text style={[typeStyle('body', language), { color: colors.textMuted }]}>{message}</Text>
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

  const plumage = plumageLabel(image.plumage_key, t);
  const author = image.credit.author ?? t('common.notRecorded');
  const alt = t('gallery.alt', { name: speciesName, plumage, author });
  const failed = failedIds.includes(image.image_id);
  // Only the species' primary image has a thumbnail; the precache keeps it for offline use.
  const thumbImage = unsorted.find((i) => i.thumb);

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
        <OfflineFallback thumb={thumbImage?.thumb ?? null} alt={alt} language={language} t={t} />
      ) : (
        <Image
          source={{ uri: mediaUrl(image.full.path) }}
          accessibilityLabel={alt}
          resizeMode="contain"
          onError={() => setFailedIds((ids) => [...ids, image.image_id])}
          style={[styles.photo, { aspectRatio: image.width / image.height }]}
        />
      )}
      <Credit
        credit={(failed && thumbImage ? thumbImage : image).credit}
        language={language}
        t={t}
      />
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
  thumb: { width: '100%', aspectRatio: 1 },
  photo: { width: '100%', borderRadius: radius.md },
  empty: { padding: space[4], borderRadius: radius.md, alignItems: 'center' },
  credit: { gap: space[1] },
});
