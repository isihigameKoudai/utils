import { defineGemini } from '@/utils/ai/google';

import type { EmbeddingResultParams } from '../models/embeddingResult';
import type { GenerationResultParams } from '../models/generationResult';

const gemini = defineGemini({
  root: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  },
  embedding: {
    outputDimensionality: 768,
  },
});

export const geminiApi = {
  async embed(text: string): Promise<EmbeddingResultParams> {
    const startTime = performance.now();
    const response = await gemini.embed(text);

    const values = response.embeddings![0].values!;
    const executionTimeMs = performance.now() - startTime;

    return {
      values,
      dimensions: values.length,
      model: 'gemini-embedding-2',
      executionTimeMs,
    };
  },

  async embedFile(file: File, text?: string): Promise<EmbeddingResultParams> {
    const startTime = performance.now();
    const response = await gemini.embedFile(file, text);

    const values = response.embeddings![0].values!;
    const executionTimeMs = performance.now() - startTime;

    return {
      values,
      dimensions: values.length,
      model: 'gemini-embedding-2',
      executionTimeMs,
    };
  },

  async generateFile(
    file: File,
    text: string,
  ): Promise<GenerationResultParams> {
    const startTime = performance.now();
    const response = await gemini.generateFile(file, text);
    const executionTimeMs = performance.now() - startTime;

    return {
      text: response.text || '',
      model: 'gemini-3-flash-preview',
      executionTimeMs,
    };
  },
};
