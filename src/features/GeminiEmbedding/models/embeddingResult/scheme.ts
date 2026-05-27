import * as v from 'valibot';

/**
 * EmbeddingResult validation schema
 * @description Embedding結果のバリデーションスキーマ
 */
export const embeddingResultSchema = v.object({
  values: v.pipe(
    v.array(v.number()),
    v.minLength(1, 'values must not be empty'),
  ),
  dimensions: v.pipe(
    v.number(),
    v.integer('dimensions must be integer'),
    v.minValue(1, 'dimensions must be positive integer'),
  ),
  model: v.pipe(v.string(), v.minLength(1, 'model is required')),
  executionTimeMs: v.pipe(
    v.number(),
    v.minValue(0, 'executionTimeMs must be non-negative'),
  ),
});
