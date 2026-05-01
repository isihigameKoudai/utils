import { useCallback, useState } from 'react';

import { gemini } from '../modules/embedding';

type EmbeddingResult = {
  values: number[];
  dimensions: number;
  model: string;
  executionTimeMs: number;
};

type GenerationResult = {
  text: string;
  model: string;
  executionTimeMs: number;
};

export function useGeminiEmbedding() {
  const [result, setResult] = useState<EmbeddingResult | null>(null);
  const [generationResult, setGenerationResult] =
    useState<GenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const embed = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('Text cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = performance.now();

    try {
      const response = await gemini.embed(text);

      const values = response.embeddings![0].values!;
      const executionTimeMs = performance.now() - startTime;

      setResult({
        values,
        dimensions: values.length,
        model: 'gemini-embedding-2',
        executionTimeMs,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const embedFile = useCallback(async (file: File, text?: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = performance.now();

    try {
      const response = await gemini.embedFile(file, text);

      const values = response.embeddings![0].values!;
      const executionTimeMs = performance.now() - startTime;

      setResult({
        values,
        dimensions: values.length,
        model: 'gemini-embedding-2',
        executionTimeMs,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFileContent = useCallback(async (file: File, text: string) => {
    setLoading(true);
    setError(null);
    setGenerationResult(null);

    const startTime = performance.now();

    try {
      const response = await gemini.generateFile(file, text);

      const executionTimeMs = performance.now() - startTime;

      setGenerationResult({
        text: response.text || '',
        model: 'gemini-3-flash-preview',
        executionTimeMs,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setGenerationResult(null);
    setError(null);
  }, []);

  return {
    embed,
    embedFile,
    generateFileContent,
    result,
    generationResult,
    loading,
    error,
    reset,
  };
}
