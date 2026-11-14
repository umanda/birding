import { StyleSheet, Text, View } from 'react-native';

import type { IucnCategory, OccurrenceCode } from '@/shared/data/content-schema';
import type { Conservation } from '@/shared/data/species-text-schema';
import type { Language } from '@/shared/i18n/language';
import type { MessageKey, Vars } from '@/shared/i18n/translate';
import { space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { IucnBadge } from '@/shared/ui/iucn-badge';
import { OccurrenceBadge } from '@/shared/ui/occurrence-badge';

import { ExternalLink } from './external-link';
import { headingProps, SECTION_HEADING_LEVEL } from './text-props';

type Props = {
  occurrenceCode: OccurrenceCode;
  iucnCategory: IucnCategory | null;
  conservation: Conservation;
  language: Language;
  t: (key: MessageKey, vars?: Vars) => string;
};

// Both IUCN values are shown when they differ; the app never picks one.
export function aviListDiffers(working: IucnCategory | null, aviList: string | null): boolean {
  return aviList !== null && aviList !== working;
}

export function SpeciesConservation(props: Props): React.JSX.Element {
  const { occurrenceCode, iucnCategory, conservation, language, t } = props;
  const { colors } = useTheme();
  const small = [typeStyle('label', language), { color: colors.textMuted }];
  // Status text is workbook text, kept verbatim, "pending" included.
  const smallPrint = (text: string | null): React.JSX.Element => (
    <Text style={small}>{text ?? t('common.notRecorded')}</Text>
  );
  const { avilist_iucn_category: aviList, birdlife_factsheet_url: factsheet } = conservation;

  return (
    <View style={styles.section}>
      <Text
        accessibilityRole="header"
        {...headingProps(SECTION_HEADING_LEVEL)}
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {t('species.section.conservation')}
      </Text>
      <OccurrenceBadge code={occurrenceCode} language={language} t={t} />
      {smallPrint(conservation.occurrence_verification_status)}
      <Text style={[typeStyle('body', language), { color: colors.text }]}>{t('iucn.label')}</Text>
      {iucnCategory ? (
        <IucnBadge category={iucnCategory} language={language} t={t} />
      ) : (
        smallPrint(null)
      )}
      {aviListDiffers(iucnCategory, aviList) ? (
        <>
          <Text style={[typeStyle('body', language), { color: colors.text }]}>
            {t('species.conservation.aviList', { category: aviList ?? '' })}
          </Text>
          <Text style={small}>{t('species.conservation.aviListDiffers')}</Text>
        </>
      ) : null}
      {smallPrint(conservation.iucn_assessment_year)}
      {smallPrint(conservation.iucn_verification_status)}
      {factsheet ? (
        <ExternalLink
          url={factsheet}
          label={t('species.conservation.factsheet')}
          language={language}
          t={t}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({ section: { gap: space[1] } });
