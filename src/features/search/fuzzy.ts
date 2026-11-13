const SHORT_WORD = 3;
const LONG_WORD = 6;

// Words under 3 chars must match exactly; 3-5 allow one edit; 6+ allow two.
export function maxEdits(length: number): number {
  if (length < SHORT_WORD) return 0;
  return length < LONG_WORD ? 1 : 2;
}

// Optimal string alignment distance (adjacent transposition counts as one edit).
export function damerauLevenshtein(a: string, b: string): number {
  const width = b.length + 1;
  const grid: number[] = [];
  const at = (i: number, j: number): number => grid[i * width + j] ?? 0;
  for (let i = 0; i <= a.length; i++) {
    for (let j = 0; j <= b.length; j++) {
      if (i === 0 || j === 0) {
        grid[i * width + j] = i + j;
        continue;
      }
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(at(i - 1, j) + 1, at(i, j - 1) + 1, at(i - 1, j - 1) + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, at(i - 2, j - 2) + 1);
      }
      grid[i * width + j] = best;
    }
  }
  return at(a.length, b.length);
}

// Edits needed for `queryWord` to match `word` or, while typing, the start of it.
// Returns Infinity without running the DP when the length gap already exceeds `max`.
export function wordDistance(queryWord: string, word: string, max: number): number {
  if (word.length < queryWord.length - max) return Infinity;
  // Cheap candidate filter (ADR 0006): a typo in the first letter is not recovered.
  if (queryWord[0] !== word[0]) return Infinity;
  const head = word.slice(0, queryWord.length);
  if (word.length - queryWord.length > max) return damerauLevenshtein(queryWord, head);
  return Math.min(damerauLevenshtein(queryWord, word), damerauLevenshtein(queryWord, head));
}
