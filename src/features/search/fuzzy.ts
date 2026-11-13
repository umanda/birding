const MAX_EXACT_LENGTH = 3;
const MAX_ONE_EDIT_LENGTH = 6;

// ADR 0006: up to 3 chars exact, 4-6 one edit, 7+ two edits.
export function maxEdits(length: number): number {
  if (length <= MAX_EXACT_LENGTH) return 0;
  return length <= MAX_ONE_EDIT_LENGTH ? 1 : 2;
}

// Optimal string alignment table (adjacent transposition counts as one edit).
// Returns the last row: distances from all of `a` to each prefix of `b`.
function lastRow(a: string, b: string): number[] {
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
  return Array.from({ length: width }, (_, j) => at(a.length, j));
}

export function damerauLevenshtein(a: string, b: string): number {
  return lastRow(a, b)[b.length] ?? 0;
}

// Edits to turn `queryWord` into any prefix of `word`, so a half-typed word still matches.
// Returns Infinity without running the DP when a cheap filter already rules the word out.
export function wordDistance(queryWord: string, word: string, max: number): number {
  if (word.length < queryWord.length - max) return Infinity;
  // Candidate filter (ADR 0006): a typo in the first letter is not recovered.
  if (queryWord[0] !== word[0]) return Infinity;
  return Math.min(...lastRow(queryWord, word));
}
