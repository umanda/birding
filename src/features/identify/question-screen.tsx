import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { HostInstance, TextProps } from 'react-native';

import { useSettings } from '@/features/settings';
import type { SpeciesTraits } from '@/shared/data/traits';
import { SCREEN_PADDING, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { headingProps } from '@/shared/ui/text-props';

import { AnswerList } from './answer-list';
import { currentMonth, parseAnswers, serializeAnswers } from './answers-params';
import { MatchFooter } from './match-footer';
import { countMatches, isStep, neighbour, STEP_OPTIONS, withAnswer } from './questions';
import type { Step } from './questions';
import { TopBar } from './top-bar';
import type { Answers } from './types';

// tabIndex -1 lets script focus the heading on web without adding it to the tab order.
const FOCUSABLE_HEADING = { ...headingProps(1), tabIndex: -1 } as TextProps;
const ADVANCE_DELAY_MS = 300; // lets the selection show before the next question

type Params = Record<string, string | string[]>;
type Props = { traits: SpeciesTraits[] };

export function QuestionScreen({ traits }: Props): React.JSX.Element {
  const { step, ...params } = useLocalSearchParams<Params>();
  if (!isStep(String(step))) return <Redirect href="/" />;
  return <Question step={step as Step} params={params} traits={traits} />;
}

type QuestionProps = { step: Step; params: Params; traits: SpeciesTraits[] };

function Question({ step, params, traits }: QuestionProps): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const router = useRouter();
  const heading = useRef<HostInstance>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cancelAdvance = (): void => clearTimeout(timer.current);

  // Only web moves focus by script; native screen readers announce the header role on arrival.
  useEffect(() => {
    if (Platform.OS === 'web') heading.current?.focus();
  }, [step]);
  useEffect(() => cancelAdvance, []);

  const answers = parseAnswers(params, currentMonth());
  const toStep = (to: Step, next: Answers): void =>
    router.replace({
      pathname: '/identify/[step]',
      params: { step: to, ...serializeAnswers(next) },
    });
  const showResults = (next: Answers): void => {
    cancelAdvance();
    router.push({ pathname: '/identify/results', params: serializeAnswers(next) });
  };
  const goBack = (): void => {
    cancelAdvance();
    const previous = neighbour(step, -1);
    if (previous) toStep(previous, answers);
    else if (router.canGoBack()) router.back();
    else router.dismissTo('/');
  };
  const select = (value: string | undefined): void => {
    const next = withAnswer(answers, step, value);
    // The explicit undefined removes a cleared answer from the params.
    router.setParams({ [step]: undefined, ...serializeAnswers(next) });
    const following = neighbour(step, 1);
    cancelAdvance();
    timer.current = setTimeout(
      () => (following ? toStep(following, next) : showResults(next)),
      ADVANCE_DELAY_MS,
    );
  };
  const monthLabel = answers.month
    ? t(`identify.monthName.${answers.month}`)
    : t('identify.monthAny');

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TopBar backLabel={t('identify.back')} language={language} onBack={goBack}>
        <Text style={[typeStyle('label', language), { color: colors.text }]}>
          {t('identify.month', { month: monthLabel })}
        </Text>
      </TopBar>
      <ScrollView contentContainerStyle={styles.body}>
        <Text
          ref={heading}
          {...FOCUSABLE_HEADING}
          accessibilityRole="header"
          style={[typeStyle('title', language), { color: colors.text }]}
        >
          {t(`identify.question.${step}`)}
        </Text>
        <AnswerList
          options={STEP_OPTIONS[step]}
          selected={answers[step]}
          language={language}
          t={t}
          onSelect={select}
        />
      </ScrollView>
      <MatchFooter
        count={countMatches(traits, answers)}
        language={language}
        t={t}
        onPress={() => showResults(answers)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: SCREEN_PADDING, gap: space[4] },
});
