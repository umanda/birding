const SINHALA_RANGE = /[඀-෿]/;
const ZERO_WIDTH_SPACE = /​/g;
// ZWNJ, ZWJ, word joiner, BOM: invisible, so typing them or not must not matter.
const INVISIBLE = /[‌‍⁠﻿]/g;
const COMBINING_MARKS = /\p{M}/gu;
const APOSTROPHES = /['’]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const WHITESPACE = /\s+/g;

export type Script = 'latin' | 'sinhala';

export function detectScript(text: string): Script {
  return SINHALA_RANGE.test(text) ? 'sinhala' : 'latin';
}

// Derived key only: display strings are never modified.
export function searchKey(text: string): string {
  const base = text.normalize('NFC').replace(INVISIBLE, '');
  if (detectScript(base) === 'sinhala') {
    return base.replace(ZERO_WIDTH_SPACE, '').replace(WHITESPACE, ' ').trim();
  }
  return base
    .replace(ZERO_WIDTH_SPACE, ' ')
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(APOSTROPHES, '')
    .replace(NON_ALPHANUMERIC, ' ')
    .trim();
}
