import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllSpecies } from '@/shared/data/content';
import type { SpeciesTraits } from '@/shared/data/traits';
import { getSpeciesTraits } from '@/shared/data/traits-data';
import { SCREEN_PADDING, space } from '@/shared/theme/tokens';
import { useTheme } from '@/shared/theme/use-theme';

import { currentMonth, parseAnswers, serializeAnswers } from './answers-params';
import type { RouteParams } from './answers-params';
import { rank } from './rank';
import { ResultRow } from './result-row';
import {
  answerChips,
  firstUnanswered,
  resultsView,
  unansweredCount,
  withoutAnswer,
} from './results-model';
import { ActionButton, CoverageFooter, NoMatchFooter, ResultsHeader } from './results-sections';
import type { Answers } from './types';

type Props = { traits: SpeciesTraits[] };

export function ResultsScreen({ traits }: Props): React.JSX.Element {
  const params = useLocalSearchParams<RouteParams>();
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const router = useRouter();
  const answers = parseAnswers(params, currentMonth());
  const { matches, closest } = resultsView(rank(traits, answers));
  const chips = answerChips(answers, t);
  const noMatch = matches.length === 0;
  const step = firstUnanswered(answers);

  // The explicit undefined deletes the key from the URL: setParams merges, so serializeAnswers
  // alone would leave the old value in place.
  const removeAnswer = (field: keyof Answers): void =>
    router.setParams({ [field]: undefined, ...serializeAnswers(withoutAnswer(answers, field)) });
  // dismissTo pops back to the earlier question screen when there is one, so Back never lands
  // on a stale question. With none (a deep link) it simply opens the question.
  const answerMore = (): void =>
    router.dismissTo({
      pathname: '/identify/[step]',
      params: { step: step ?? 'zone', ...serializeAnswers(answers) },
    });

  const footer = (
    <View style={styles.stack}>
      {noMatch ? (
        <NoMatchFooter
          lastChip={chips[chips.length - 1]}
          onRemove={removeAnswer}
          language={language}
          t={t}
        />
      ) : null}
      {step ? (
        <ActionButton
          label={t('identify.results.more', { count: unansweredCount(answers) })}
          language={language}
          onPress={answerMore}
        />
      ) : null}
    </View>
  );
  const title = noMatch
    ? t('identify.noMatches')
    : t('identify.results.title', { count: matches.length });

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <FlatList
        style={styles.screen}
        contentContainerStyle={styles.list}
        data={noMatch ? closest : matches}
        keyExtractor={(result) => result.species_id}
        ListHeaderComponent={
          <ResultsHeader
            title={title}
            chips={chips}
            noMatch={noMatch}
            onRemove={removeAnswer}
            language={language}
            t={t}
          />
        }
        ListFooterComponent={footer}
        renderItem={({ item }) => <ResultRow result={item} language={language} t={t} />}
      />
      <CoverageFooter
        count={traits.length}
        total={getAllSpecies().length}
        language={language}
        t={t}
      />
    </View>
  );
}

export function ResultsRoute(): React.JSX.Element {
  return <ResultsScreen traits={getSpeciesTraits()} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: SCREEN_PADDING, gap: space[3] },
  stack: { gap: space[3] },
});
