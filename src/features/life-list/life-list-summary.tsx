import { StyleSheet, Text, View } from 'react-native';

import type { OccurrenceCode } from '@/shared/data/content-schema';
import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { radius, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { appearanceOf } from '@/shared/ui/occurrence-badge';

import type { LifeListSummary } from './aggregate';

type Props = { summary: LifeListSummary; language: Language; t: Translate };

// The exact workbook codes, in the order the spec lists them.
const CODES: readonly OccurrenceCode[] = ['E', 'R', 'M', 'R/M', 'R+M', 'R+(M)'];

export function LifeListSummaryCard({ summary, language, t }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const { species, sightings, endemics, endemicsTotal, byCode, unknown } = summary;
  const counts = { count: endemics, total: endemicsTotal };
  const lines: { key: string; text: string }[] = CODES.map((code) => {
    const { shape, wordKey } = appearanceOf(code);
    return { key: code, text: `${shape} ${code} ${t(wordKey)}: ${byCode[code]}` };
  });
  if (unknown > 0) lines.push({ key: 'unknown', text: `${t('lifeList.removed')}: ${unknown}` });
  const body = [typeStyle('body', language), { color: colors.text }];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={body}>{t('lifeList.summary.species', { count: species })}</Text>
      <Text accessibilityLabel={t('lifeList.summary.endemicsLabel', counts)} style={body}>
        {t('lifeList.summary.endemics', counts)}
      </Text>
      <Text style={body}>{t('lifeList.summary.sightings', { count: sightings })}</Text>
      {lines.map(({ key, text }) => (
        <Text key={key} style={[typeStyle('label', language), { color: colors.textMuted }]}>
          {text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: space[1], padding: space[3], borderRadius: radius.md },
});
