import type { Species } from '../../shared/data/content-schema';
import { maxEdits, wordDistance } from './fuzzy';
import { detectScript, searchKey, type Script } from './search-key';

export const DEFAULT_LIMIT = 50;

type Entry = {
  id: string;
  key: string;
  words: string[];
};

export type SearchIndex = {
  latin: Entry[];
  sinhala: Entry[];
};

// Lower rank first. Fuzzy ranks follow the exact-ish tiers, ordered by edit count.
const TIER = { exact: 0, prefix: 1, wordPrefix: 2, substring: 3, fuzzy: 4 } as const;

function makeEntry(id: string, text: string): Entry {
  const key = searchKey(text);
  return { id, key, words: key.split(' ') };
}

export function buildIndex(species: readonly Species[]): SearchIndex {
  const index: SearchIndex = { latin: [], sinhala: [] };
  for (const { species_id, names } of species) {
    index.latin.push(makeEntry(species_id, names.en), makeEntry(species_id, names.scientific));
    if (names.si) index.sinhala.push(makeEntry(species_id, names.si));
  }
  return index;
}

const allWordsStartWith = (queryWords: string[], words: string[]): boolean =>
  queryWords.every((q) => words.some((w) => w.startsWith(q)));

function fuzzyEdits(queryWords: string[], words: string[]): number | undefined {
  let total = 0;
  for (const q of queryWords) {
    const max = maxEdits(q.length);
    const best = Math.min(...words.map((w) => wordDistance(q, w, max)));
    if (best > max) return undefined;
    total += best;
  }
  return total;
}

// Returns a rank (tier + edits) or undefined for no match.
function rank(entry: Entry, query: string, script: Script): number | undefined {
  if (entry.key === query) return TIER.exact;
  if (entry.key.startsWith(query)) return TIER.prefix;
  const queryWords = query.split(' ');
  if (allWordsStartWith(queryWords, entry.words)) return TIER.wordPrefix;
  // Sinhala: substring only, no edit distance (ADR 0006).
  if (script === 'sinhala') return entry.key.includes(query) ? TIER.substring : undefined;
  const edits = fuzzyEdits(queryWords, entry.words);
  return edits === undefined ? undefined : TIER.fuzzy + edits;
}

export function search(index: SearchIndex, query: string, limit = DEFAULT_LIMIT): string[] {
  const key = searchKey(query);
  if (key === '') return [];
  const script = detectScript(key);
  const entries = script === 'sinhala' ? index.sinhala : index.latin;
  const best = new Map<string, number>();
  for (const entry of entries) {
    const r = rank(entry, key, script);
    if (r !== undefined && r < (best.get(entry.id) ?? Infinity)) best.set(entry.id, r);
  }
  // Map keeps insertion order and sort is stable, so ties keep content order.
  return [...best.entries()]
    .sort((a, b) => a[1] - b[1])
    .slice(0, limit)
    .map(([id]) => id);
}
