import type { EmbeddingResultParams } from '../../models/embeddingResult';

export type EmbeddingState = {
  result: EmbeddingResultParams | null;
  isLoading: boolean;
  error: string | null;
};
