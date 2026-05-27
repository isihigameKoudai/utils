import type { ActionsProps } from '@/utils/i-state';

import type { DatabaseItemParams } from '../../models/databaseItem';

import type { queries } from './queries';
import type { ChromaStatus, DatabaseState } from './type';

export const actions = {
  addItem({ state, dispatch }, item: DatabaseItemParams) {
    dispatch('items', [...state.items, item]);
  },

  removeItem({ state, dispatch }, id: string) {
    dispatch(
      'items',
      state.items.filter((item) => item.id !== id),
    );
  },

  clearItems({ dispatch }) {
    dispatch('items', []);
  },

  setSearchResults(
    { dispatch },
    results: Array<DatabaseItemParams & { similarity: number }> | null,
  ) {
    dispatch('searchResults', results);
  },

  clearSearchResults({ dispatch }) {
    dispatch('searchResults', null);
  },

  setSearchOrder({ dispatch }, order: 'closest' | 'furthest') {
    dispatch('searchOrder', order);
  },

  setChromaUrl({ dispatch }, url: string) {
    dispatch('chromaUrl', url);
  },

  setChromaCollectionName({ dispatch }, name: string) {
    dispatch('chromaCollectionName', name);
  },

  setChromaStatus({ dispatch }, status: ChromaStatus) {
    dispatch('chromaStatus', status);
  },

  setChromaError({ dispatch }, error: string | null) {
    dispatch('chromaError', error);
  },
} satisfies ActionsProps<DatabaseState, typeof queries>;
