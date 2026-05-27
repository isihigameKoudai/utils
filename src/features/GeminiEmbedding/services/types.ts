import type { geminiApi } from '../api/gemini';
import type { EmbeddingStore } from '../stores/embedding';

export type EmbeddingServiceDeps = {
  api: typeof geminiApi;
  actions: ReturnType<typeof EmbeddingStore.useStore>['actions'];
};
