import type { defineGemini } from '@utils/modules/ai/google';

export type GeminiApi = Pick<
	ReturnType<typeof defineGemini>,
	'embed' | 'embedFile' | 'generateFile'
>;
