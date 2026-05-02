import type { EmbeddingServiceDeps } from './types';

export const createEmbeddingService = ({
  api,
  actions,
}: EmbeddingServiceDeps) => ({
  async embedText(text: string) {
    if (!text.trim()) {
      actions.setError('Text cannot be empty');
      return null;
    }

    actions.setLoading(true);
    actions.clearError();
    actions.clearResult();

    try {
      const result = await api.embed(text);
      actions.setResult(result);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      actions.setError(message);
      return null;
    } finally {
      actions.setLoading(false);
    }
  },

  async embedFile(file: File, text?: string) {
    actions.setLoading(true);
    actions.clearError();
    actions.clearResult();

    try {
      const result = await api.embedFile(file, text);
      actions.setResult(result);
      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';
      actions.setError(message);
      return null;
    } finally {
      actions.setLoading(false);
    }
  },

  reset() {
    actions.reset();
  },
});
