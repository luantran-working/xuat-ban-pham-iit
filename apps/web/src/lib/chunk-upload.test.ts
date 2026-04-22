import { describe, expect, it } from 'vitest';
import { buildChunkPlan } from './chunk-upload';

describe('buildChunkPlan', () => {
  it('chia file thành các chunk đúng kích thước và phần cuối còn lại', () => {
    const file = new File([
      new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    ], 'demo.pdf', {
      type: 'application/pdf',
    });

    const plan = buildChunkPlan(file, 4);

    expect(plan.chunkSize).toBe(4);
    expect(plan.chunks).toHaveLength(3);
    expect(plan.chunks.map((chunk) => chunk.size)).toEqual([4, 4, 2]);
    expect(plan.chunks.map((chunk) => chunk.index)).toEqual([0, 1, 2]);
  });
});
