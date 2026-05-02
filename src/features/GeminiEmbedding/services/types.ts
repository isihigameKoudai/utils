import type { GeminiApi } from '../api/types';
import type { EmbeddingStore } from '../stores/embedding';

export type EmbeddingActions = ReturnType<
  typeof EmbeddingStore.useStore
>['actions'];

export type EmbeddingServiceDeps = {
  api: GeminiApi;
  actions: EmbeddingActions;
};
