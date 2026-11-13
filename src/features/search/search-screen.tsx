import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useSettings } from '@/features/settings';
import { getAllSpecies, getSpecies } from '@/shared/data/content';
import type { Species } from '@/shared/data/content-schema';
import { radius, SCREEN_PADDING, size, space } from '@/shared/theme/tokens';
import { typeStyle } from '@/shared/theme/type-style';
import { useTheme } from '@/shared/theme/use-theme';
import { SpeciesRow } from '@/shared/ui/species-row';

import { buildIndex, search } from './search-index';

const index = buildIndex(getAllSpecies());

function findSpecies(query: string): Species[] {
  return search(index, query).flatMap((id) => getSpecies(id) ?? []);
}

export function SearchScreen(): React.JSX.Element {
  const { language, t } = useSettings();
  const { colors } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const results = useMemo(() => findSpecies(query), [query]);
  const isTyping = query.trim() !== '';

  const openSpecies = (id: string): void =>
    router.push({ pathname: '/species/[id]', params: { id } });
  const openBrowse = (): void => router.push('/browse');
  const text = [typeStyle('body', language), { color: colors.text }];
  const muted = [typeStyle('body', language), { color: colors.textMuted }];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.field, { borderColor: colors.primary }]}>
        <TextInput
          autoFocus
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel={t('search.label')}
          placeholder={t('search.label')}
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          style={[styles.input, ...text]}
        />
        {isTyping ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('search.clear')}
            onPress={() => setQuery('')}
            style={styles.clear}
          >
            <Text style={text}>✕</Text>
          </Pressable>
        ) : null}
      </View>
      {isTyping && results.length > 0 ? (
        <Text accessibilityLiveRegion="polite" style={muted}>
          {t('search.results', { count: results.length })}
        </Text>
      ) : null}
      {isTyping && results.length === 0 ? (
        <Text style={muted}>{t('search.noMatch', { query: query.trim() })}</Text>
      ) : null}
      {isTyping ? null : <Text style={muted}>{t('search.hint')}</Text>}
      {!isTyping || results.length === 0 ? (
        <Pressable accessibilityRole="link" onPress={openBrowse} style={styles.link}>
          <Text style={[typeStyle('label', language), { color: colors.primary }]}>
            {t('search.browseLink')}
          </Text>
        </Pressable>
      ) : null}
      <FlatList
        testID="search-results"
        data={results}
        keyExtractor={(item) => item.species_id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <Pressable accessibilityRole="link" onPress={() => openSpecies(item.species_id)}>
            <SpeciesRow species={item} language={language} t={t} />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SCREEN_PADDING, gap: space[2] },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space[3],
  },
  input: { flex: 1, minHeight: size.touchMin },
  clear: {
    minWidth: size.touchMin,
    minHeight: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: { minHeight: size.touchMin, justifyContent: 'center' },
});
