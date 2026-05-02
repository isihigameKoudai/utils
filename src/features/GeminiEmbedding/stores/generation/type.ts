import type { GenerationResultParams } from '../../models/generationResult';

export type GenerationState = {
  result: GenerationResultParams | null;
  isLoading: boolean;
  error: string | null;
};
