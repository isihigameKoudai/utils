import { defineGemini } from '@/utils/ai/google';

export type GeminiApi = Pick<
  ReturnType<typeof defineGemini>,
  'embed' | 'embedFile' | 'generateFile'
>;
