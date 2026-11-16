import { StyleSheet, Text, View } from 'react-native';

import type { ManifestImage } from '@/shared/data/media';
import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';

import { ExternalLink } from './external-link';

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

const styles = StyleSheet.create({
  credit: { gap: space[1] },
});
