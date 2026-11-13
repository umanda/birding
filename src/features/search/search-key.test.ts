import { detectScript, searchKey } from './search-key';

const ZWSP = '​';
const ZWNJ = '‌';
const ZWJ = '‍';
// SRI (U+0DC1 U+0DCA U+0DBB U+0DD3) written without and with a joiner after the virama.
const SRI = 'ශ්රී';
const SRI_JOINED = 'ශ්‍රී';

describe('searchKey', () => {
  it.each([
    ['  Sri   Lanka  Junglefowl ', 'sri lanka junglefowl'],
    ['Blue-breasted Quail', 'blue breasted quail'],
    ['Café Ñandú', 'cafe nandu'],
    ['Galluś laf', 'gallus laf'],
    ['Richard’s Pipit', 'richards pipit'],
    ["Richard's Pipit", 'richards pipit'],
    [`Sri${ZWSP}Lanka`, 'sri lanka'],
  ])('latin %j -> %j', (input, expected) => {
    expect(searchKey(input)).toBe(expected);
  });

  it('strips joiners from Sinhala and collapses spaces only', () => {
    expect(searchKey(`${SRI_JOINED}${ZWNJ}  ${SRI}`)).toBe(`${SRI} ${SRI}`);
    expect(searchKey(`${SRI}${ZWSP}`)).toBe(SRI);
  });

  it('is NFC for Sinhala', () => {
    expect(searchKey('ො')).toBe('ො');
  });

  it('keeps ZWJ out of the result', () => {
    expect(searchKey(`a${ZWJ}b`)).toBe('ab');
  });
});

describe('detectScript', () => {
  it.each([
    ['Sri Lanka', 'latin'],
    ['', 'latin'],
    ['Sri 2', 'latin'],
    [SRI, 'sinhala'],
    [`123 ${SRI}`, 'sinhala'],
    [`Sri ${SRI}`, 'sinhala'],
  ])('%j is %s', (text, expected) => {
    expect(detectScript(text)).toBe(expected);
  });
});
