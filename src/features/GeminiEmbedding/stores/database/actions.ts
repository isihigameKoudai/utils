import type { ActionsProps } from '@/utils/i-state';

import type { DatabaseItemParams } from '../../models/databaseItem';

import type { queries } from './queries';
import type { DatabaseState } from './type';

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
} satisfies ActionsProps<DatabaseState, typeof queries>;
