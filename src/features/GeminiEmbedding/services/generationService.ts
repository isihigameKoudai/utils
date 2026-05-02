import type { GeminiApi } from '../api/types';
import type { GenerationStore } from '../stores/generation';

type GenerationActions = ReturnType<typeof GenerationStore.useStore>['actions'];

type GenerationServiceDeps = {
  api: GeminiApi;
  actions: GenerationActions;
};

export const createGenerationService = ({
  api,
  actions,
}: GenerationServiceDeps) => ({
  async generateFileContent(file: File, text: string) {
    actions.setLoading(true);
    actions.clearError();
    actions.clearResult();

    try {
      const result = await api.generateFile(file, text);
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
