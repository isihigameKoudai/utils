import type { ActionsProps } from '@/utils/i-state';

import type { GenerationResultParams } from '../../models/generationResult';

import type { queries } from './queries';
import type { GenerationState } from './type';

export const actions = {
  setResult({ dispatch }, result: GenerationResultParams) {
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
} satisfies ActionsProps<GenerationState, typeof queries>;
