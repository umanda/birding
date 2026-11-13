import { damerauLevenshtein, maxEdits, wordDistance } from './fuzzy';

describe('maxEdits', () => {
  it.each([
    [1, 0],
    [3, 0],
    [4, 1],
    [6, 1],
    [7, 2],
    [12, 2],
  ])('length %i allows %i edits', (length, expected) => {
    expect(maxEdits(length)).toBe(expected);
  });
});

describe('damerauLevenshtein', () => {
  it.each([
    ['', '', 0],
    ['', 'abc', 3],
    ['abc', '', 3],
    ['abc', 'abc', 0],
    ['ab', 'ba', 1],
    ['kitten', 'sitting', 3],
    ['ca', 'abc', 3],
  ])('%j vs %j = %i', (a, b, expected) => {
    expect(damerauLevenshtein(a, b)).toBe(expected);
  });
});

describe('wordDistance', () => {
  it('accepts a half-typed word', () => {
    expect(wordDistance('jungle', 'junglefowl', 1)).toBe(0);
  });

  it('counts a typo inside a half-typed word', () => {
    expect(wordDistance('junlge', 'junglefowl', 1)).toBe(1);
    expect(wordDistance('jungl', 'jungle', 1)).toBe(0);
  });

  it('returns Infinity when the word is too short to match', () => {
    expect(wordDistance('junglefowl', 'jungle', 2)).toBe(Infinity);
  });

  it('returns Infinity when the first letters differ', () => {
    expect(wordDistance('xungle', 'jungle', 2)).toBe(Infinity);
  });
});
