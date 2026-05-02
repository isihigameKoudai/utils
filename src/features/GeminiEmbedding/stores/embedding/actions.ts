import type { ActionsProps } from '@/utils/i-state';

import type { EmbeddingResultParams } from '../../models/embeddingResult';

import type { queries } from './queries';
import type { EmbeddingState } from './type';

export const actions = {
  setResult({ dispatch }, result: EmbeddingResultParams) {
    dispatch('result', result);
  },

  clearResult({ dispatch }) {
    dispatch('result', null);
  },

  setLoading({ dispatch }, isLoading: boolean) {
    dispatch('isLoading', isLoading);
  },

  setError({ dispatch }, error: string | null) {
    dispatch('error', error);
  },

  clearError({ dispatch }) {
    dispatch('error', null);
  },

  reset({ dispatch }) {
    dispatch('result', null);
    dispatch('error', null);
  },
} satisfies ActionsProps<EmbeddingState, typeof queries>;
