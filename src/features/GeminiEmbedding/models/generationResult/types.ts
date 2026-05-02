import type { InferOutput } from 'valibot';

import type { generationResultSchema } from './scheme';

export type GenerationResultParams = InferOutput<typeof generationResultSchema>;

export type GenerationResult = GenerationResultParams & {
  readonly executionTimeLabel: string;
  readonly isEmpty: boolean;
  readonly charCount: number;
};
