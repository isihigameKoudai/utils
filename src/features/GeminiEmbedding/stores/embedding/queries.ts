import type { QueriesProps } from '@/utils/i-state';

import {
  createEmbeddingResult,
  isEmbeddingResultEmpty,
  type EmbeddingResult,
} from '../../models/embeddingResult';

import type { EmbeddingState } from './type';

export const queries = {
  result: (state): EmbeddingResult | null => {
    if (!state.result || isEmbeddingResultEmpty(state.result)) return null;
    return createEmbeddingResult(state.result);
  },

  hasResult: (state): boolean => {
    return state.result !== null && !isEmbeddingResultEmpty(state.result);
  },

  isLoading: (state): boolean => state.isLoading,

  error: (state): string | null => state.error,
} satisfies QueriesProps<EmbeddingState>;
