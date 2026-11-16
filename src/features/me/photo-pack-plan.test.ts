import type { ManifestImage } from '@/shared/data/media';
import { fixtureImage } from '@/test-utils/media-fixture';

import { formatBytes, packPlan } from './photo-pack-plan';

function withBytes(id: string, bytes: number): ManifestImage {
  const full = { ...fixtureImage().full, path: `media/${id}.webp`, bytes };
  return fixtureImage({ image_id: id, full });
}

describe('packPlan', () => {
  it('is empty for an empty manifest', () => {
    expect(packPlan([], new Set())).toEqual({
      totalCount: 0,
      totalBytes: 0,
      remaining: [],
      remainingBytes: 0,
    });
  });

  it('plans every photo when nothing is cached', () => {
    const plan = packPlan([withBytes('a', 100), withBytes('b', 200)], new Set());
    expect(plan.remaining).toEqual([
      { url: '/media/a.webp', bytes: 100 },
      { url: '/media/b.webp', bytes: 200 },
    ]);
    expect([plan.totalBytes, plan.remainingBytes]).toEqual([300, 300]);
  });

  it('skips cached photos but keeps the totals', () => {
    const plan = packPlan([withBytes('a', 100), withBytes('b', 200)], new Set(['/media/a.webp']));
    expect(plan.remaining).toEqual([{ url: '/media/b.webp', bytes: 200 }]);
    expect([plan.totalCount, plan.totalBytes, plan.remainingBytes]).toEqual([2, 300, 200]);
  });

  it('has nothing left when all are cached', () => {
    const plan = packPlan([withBytes('a', 100)], new Set(['/media/a.webp']));
    expect(plan.remaining).toEqual([]);
    expect(plan.remainingBytes).toBe(0);
  });
});

describe('formatBytes', () => {
  it.each([
    [0, '0 B'],
    [1023, '1023 B'],
    [2048, '2 KB'],
    [4.1 * 1024 * 1024, '4.1 MB'],
  ])('formats %d as %s', (bytes, text) => {
    expect(formatBytes(bytes)).toBe(text);
  });
});
