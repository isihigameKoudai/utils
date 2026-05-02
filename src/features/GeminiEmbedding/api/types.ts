import type { EmbeddingResultParams } from '../models/embeddingResult';
import type { GenerationResultParams } from '../models/generationResult';

export type GeminiApi = {
  embed(text: string): Promise<EmbeddingResultParams>;
  embedFile(file: File, text?: string): Promise<EmbeddingResultParams>;
  generateFile(file: File, text: string): Promise<GenerationResultParams>;
};
