import type { QueriesProps } from '@/utils/i-state';

import {
  createGenerationResult,
  isGenerationResultEmpty,
  type GenerationResult,
} from '../../models/generationResult';

import type { GenerationState } from './type';

export const queries = {
  result: (state): GenerationResult | null => {
    if (!state.result || isGenerationResultEmpty(state.result)) return null;
    return createGenerationResult(state.result);
  },

  hasResult: (state): boolean => {
    return state.result !== null && !isGenerationResultEmpty(state.result);
  },

  isLoading: (state): boolean => state.isLoading,

  error: (state): string | null => state.error,
} satisfies QueriesProps<GenerationState>;
