import type { QueriesProps } from '@/utils/i-state';

import {
  createDatabaseItem,
  isDatabaseItemEmpty,
  type DatabaseItem,
} from '../../models/databaseItem';

import type { DatabaseState } from './type';

export const queries = {
  items: (state): DatabaseItem[] =>
    state.items
      .filter((item) => !isDatabaseItemEmpty(item))
      .map((item) => createDatabaseItem(item)),

  itemCount: (state): number =>
    state.items.filter((item) => !isDatabaseItemEmpty(item)).length,

  searchResults: (
    state,
  ): Array<DatabaseItem & { similarity: number }> | null => {
    if (!state.searchResults) return null;

    const results = state.searchResults.map((item) => ({
      ...createDatabaseItem(item),
      similarity: item.similarity,
    }));

    return [...results].sort((a, b) => {
      if (state.searchOrder === 'closest') {
        return b.similarity - a.similarity;
      } else {
        return a.similarity - b.similarity;
      }
    });
  },

  hasSearchResults: (state): boolean => state.searchResults !== null,

  searchOrder: (state): 'closest' | 'furthest' => state.searchOrder,
} satisfies QueriesProps<DatabaseState>;
