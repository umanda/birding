import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Language } from '@/shared/i18n/language';
import type { Translate } from '@/shared/i18n/translate';
import { SCREEN_PADDING, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { headingProps, SECTION_HEADING_LEVEL } from '@/shared/ui/text-props';

import { AnswerChips } from './answer-chips';
import type { Chip } from './results-model';
import type { Answers } from './types';

type Common = { language: Language; t: Translate };
type Remove = (field: keyof Answers) => void;

type ActionProps = { label: string; language: Language; onPress: () => void };

export function ActionButton({ label, language, onPress }: ActionProps): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.action}>
      <Text style={[typeStyle('label', language), { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

function TextLink(props: { label: string; href: Href; language: Language }): React.JSX.Element {
  const { colors } = useTheme();
  return (
    <Link href={props.href} asChild>
      <Pressable accessibilityRole="link" style={styles.action}>
        <Text style={[typeStyle('label', props.language), { color: colors.primary }]}>
          {props.label}
        </Text>
      </Pressable>
    </Link>
  );
}

type HeaderProps = Common & {
  title: string;
  chips: Chip[];
  noMatch: boolean;
  onRemove: Remove;
};

export function ResultsHeader(props: HeaderProps): React.JSX.Element {
  const { title, chips, noMatch, onRemove, language, t } = props;
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      {/* Live region: removing a chip changes the title, and screen readers announce it. */}
      <Text
        {...headingProps(1)}
        accessibilityRole="header"
        accessibilityLiveRegion="polite"
        style={[typeStyle('title', language), { color: colors.text }]}
      >
        {title}
      </Text>
      <AnswerChips chips={chips} language={language} t={t} onRemove={onRemove} />
      {noMatch ? (
        <>
          <Text style={[typeStyle('body', language), { color: colors.text }]}>
            {t('identify.results.noneFit')}
          </Text>
          <Text style={[typeStyle('label', language), { color: colors.text }]}>
            {t('identify.results.closest')}
          </Text>
        </>
      ) : null}
    </View>
  );
}

type NoMatchProps = Common & { lastChip: Chip | undefined; onRemove: Remove };

export function NoMatchFooter(props: NoMatchProps): React.JSX.Element {
  const { lastChip, onRemove, language, t } = props;
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      {lastChip ? (
        <ActionButton
          label={t('identify.results.removeLast', { label: lastChip.label })}
          language={language}
          onPress={() => onRemove(lastChip.field)}
        />
      ) : null}
      <Text
        {...headingProps(SECTION_HEADING_LEVEL)}
        accessibilityRole="header"
        style={[typeStyle('label', language), { color: colors.text }]}
      >
        {t('identify.results.notListed')}
      </Text>
    </View>
  );
}

type CoverageProps = Common & { count: number; total: number };

// Fixed under the list, not in it, so virtualisation can never leave it unrendered.
export function CoverageFooter(props: CoverageProps): React.JSX.Element {
  const { count, total, language, t } = props;
  const { colors } = useTheme();
  return (
    <View style={[styles.coverage, { backgroundColor: colors.surface }]}>
      <Text style={[typeStyle('body', language), { color: colors.text }]}>
        {t('identify.results.coverage', { count, total })}
      </Text>
      <View style={styles.links}>
        <TextLink label={t('tabs.browse')} href="/browse" language={language} />
        <TextLink label={t('tabs.search')} href="/search" language={language} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space[3] },
  action: { minHeight: size.touchMin, justifyContent: 'center' },
  coverage: { padding: SCREEN_PADDING, gap: space[1] },
  links: { flexDirection: 'row', gap: space[5] },
});
