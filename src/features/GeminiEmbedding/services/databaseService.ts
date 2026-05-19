import type {
  AddDocumentArgs,
  QueryDocumentResult,
  Collection as ChromaCollection,
} from '@/utils/db/chroma';
import { cosineSimilarity } from '@/utils/math';

import type { DatabaseItemParams, InputMode } from '../models/databaseItem';
import { createDatabaseItemParams } from '../models/databaseItem';
import type { EmbeddingResultParams } from '../models/embeddingResult';
import type { DatabaseStore } from '../stores/database';

type DatabaseActions = ReturnType<typeof DatabaseStore.useStore>['actions'];

type ChromaOps = {
  addDocuments(
    collection: ChromaCollection,
    docs: AddDocumentArgs[],
  ): Promise<void>;
  getDocuments(
    collection: ChromaCollection,
    embedding: number[],
    nResults?: number,
  ): Promise<QueryDocumentResult[]>;
};

type DatabaseServiceDeps = {
  actions: DatabaseActions;
  chroma: ChromaOps;
};

export const createDatabaseService = ({
  actions,
  chroma,
}: DatabaseServiceDeps) => ({
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

  async addToChroma(
    collection: ChromaCollection,
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

    await chroma.addDocuments(collection, [
      {
        id: item.id,
        embedding: item.values,
        document: label,
        metadata: { label, type, previewUrl: previewUrl ?? '' },
      },
    ]);

    return item;
  },

  async searchChroma(
    collection: ChromaCollection,
    queryVector: EmbeddingResultParams,
    nResults: number = 10,
  ) {
    const rows = await chroma.getDocuments(
      collection,
      queryVector.values,
      nResults,
    );

    const results: Array<DatabaseItemParams & { similarity: number }> =
      rows.map((row) => ({
        id: row.id,
        label: (row.metadata?.['label'] as string | undefined) ?? row.id,
        type: ((row.metadata?.['type'] as string | undefined) ??
          'text') as InputMode,
        previewUrl:
          (row.metadata?.['previewUrl'] as string | undefined) || null,
        values: [],
        similarity: 1 - row.distance,
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
