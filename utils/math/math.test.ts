import { describe, it, expect } from 'vitest';

import { dotProduct, magnitude, cosineSimilarity } from './index';

describe('vector math utilities', () => {
  describe('dotProduct', () => {
    it('calculates the dot product of two vectors', () => {
      expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(1 * 4 + 2 * 5 + 3 * 6);
    });

    it('throws an error if vectors have different lengths', () => {
      expect(() => dotProduct([1, 2], [1, 2, 3])).toThrow(
        'Vectors must be of the same length',
      );
    });
  });

  describe('magnitude', () => {
    it('calculates the magnitude of a vector', () => {
      expect(magnitude([3, 4])).toBe(5);
    });

    it('returns 0 for a zero vector', () => {
      expect(magnitude([0, 0, 0])).toBe(0);
    });
  });

  describe('cosineSimilarity', () => {
    it('returns 1 for identical vectors', () => {
      expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1);
    });

    it('returns 1 for collinear vectors in the same direction', () => {
      expect(cosineSimilarity([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
    });

    it('returns -1 for collinear vectors in opposite directions', () => {
      expect(cosineSimilarity([1, 2, 3], [-1, -2, -3])).toBeCloseTo(-1);
    });

    it('returns 0 for orthogonal vectors', () => {
      expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
    });

    it('returns 0 if one of the vectors is a zero vector', () => {
      expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
    });
  });
});
