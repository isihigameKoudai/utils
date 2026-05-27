import * as v from 'valibot';

export const generationResultSchema = v.object({
  text: v.string(),
  model: v.pipe(v.string(), v.minLength(1, 'model is required')),
  executionTimeMs: v.pipe(
    v.number(),
    v.minValue(0, 'executionTimeMs must be non-negative'),
  ),
});
