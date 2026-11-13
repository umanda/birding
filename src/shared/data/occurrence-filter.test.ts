import type { Species } from './content-schema';
import { matchesFilters, parseFilters, serializeFilters } from './occurrence-filter';

const withCode = (occurrence_code: Species['occurrence_code']): Species =>
  ({ occurrence_code }) as Species;

describe('filter param', () => {
  it.each([
    [undefined, []],
    ['', []],
    ['M,E', ['E', 'M']],
    [
      ['M', 'E'],
      ['E', 'M'],
    ],
    ['E,X,R', ['E', 'R']],
  ] as const)('parses %p', (param, expected) => {
    expect(parseFilters(param)).toEqual(expected);
  });

  it('round-trips and clears to undefined', () => {
    expect(parseFilters(serializeFilters(['R', 'M']))).toEqual(['R', 'M']);
    expect(serializeFilters([])).toBeUndefined();
  });
});

describe('matchesFilters', () => {
  it.each([
    ['E', ['E'], true],
    ['E', ['R'], false],
    ['R/M', ['R'], true],
    ['R+M', ['M'], true],
    ['R+(M)', ['E'], false],
    ['R+(M)', ['E', 'M'], true],
    ['M', [], true],
  ] as const)('%s with %j is %s', (code, filters, expected) => {
    expect(matchesFilters(withCode(code), filters)).toBe(expected);
  });
});
