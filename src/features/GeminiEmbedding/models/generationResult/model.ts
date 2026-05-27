import { createModelFactory } from '@/utils/model/createModel';

import { generationResultSchema } from './scheme';
import type { GenerationResult, GenerationResultParams } from './types';

export const createGenerationResult = createModelFactory<
  GenerationResultParams,
  GenerationResult
>({
  schema: generationResultSchema,
  extension: (params) => ({
    get executionTimeLabel() {
      return `${params.executionTimeMs.toFixed(2)}ms`;
    },
    get isEmpty() {
      return params.text.trim().length === 0;
    },
    get charCount() {
      return params.text.length;
    },
  }),
});

export const isGenerationResultEmpty = (
  params: Partial<GenerationResultParams>,
): boolean => {
  return !params.text || params.text.trim().length === 0;
};
