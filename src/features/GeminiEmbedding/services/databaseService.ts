import { cosineSimilarity } from '@/utils/math';

import type { DatabaseItemParams, InputMode } from '../models/databaseItem';
import { createDatabaseItemParams } from '../models/databaseItem';
import type { EmbeddingResultParams } from '../models/embeddingResult';
import type { DatabaseStore } from '../stores/database';

type DatabaseActions = ReturnType<typeof DatabaseStore.useStore>['actions'];

type DatabaseServiceDeps = {
  actions: DatabaseActions;
};

export const createDatabaseService = ({ actions }: DatabaseServiceDeps) => ({
  addItemFromEmbedding(
    result: EmbeddingResultParams,
    label: string,
    type: InputMode,
    previewUrl: string | null = null,
  ) {
    const item = createDatabaseItemParams({
      label,
      previewUrl,
      values: result.values,
      type,
    });
    actions.addItem(item);
  },

  searchDatabase(
    database: DatabaseItemParams[],
    queryVector: EmbeddingResultParams,
  ) {
    const results = database.map((item) => ({
      ...item,
      similarity: cosineSimilarity(queryVector.values, item.values),
    }));
    actions.setSearchResults(results);
  },

  clearSearch() {
    actions.clearSearchResults();
  },

  setSearchOrder(order: 'closest' | 'furthest') {
    actions.setSearchOrder(order);
  },

  clearDatabase() {
    actions.clearItems();
    actions.clearSearchResults();
  },
});
