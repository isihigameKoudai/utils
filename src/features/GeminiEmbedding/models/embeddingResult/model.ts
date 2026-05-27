import { createModelFactory } from '@/utils/model/createModel';

import { embeddingResultSchema } from './scheme';
import type { EmbeddingResult, EmbeddingResultParams } from './types';

/**
 * EmbeddingResult Model Factory
 * @description イミュータブルなEmbeddingResultモデルを生成
 * @example
 * const result = createEmbeddingResult({
 *   values: [0.1, 0.2, 0.3, ...],
 *   dimensions: 768,
 *   model: 'gemini-embedding-2',
 *   executionTimeMs: 123.45,
 * });
 * console.log(result.dimensionsLabel); // '768'
 * console.log(result.vectorNorm); // 1.2345
 */
export const createEmbeddingResult = createModelFactory<
  EmbeddingResultParams,
  EmbeddingResult
>({
  schema: embeddingResultSchema,
  extension: (params) => {
    const norm = Math.sqrt(
      params.values.reduce((sum, val) => sum + val * val, 0),
    );
    const preview = params.values.slice(0, 100);

    return {
      get dimensionsLabel() {
        return String(params.dimensions);
      },
      get executionTimeLabel() {
        return `${params.executionTimeMs.toFixed(2)}ms`;
      },
      get vectorNorm() {
        return norm;
      },
      get previewValues() {
        return preview;
      },
      get previewString() {
        const values = preview.join(', ');
        return params.values.length > 100 ? `[${values}, ...]` : `[${values}]`;
      },
    };
  },
});

/**
 * Empty check (static method equivalent)
 * @description 空判定
 */
export const isEmbeddingResultEmpty = (
  params: Partial<EmbeddingResultParams>,
): boolean => {
  return !params.values || params.values.length === 0;
};
