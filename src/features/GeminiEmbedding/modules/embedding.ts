import { defineGemini } from '@/utils/ai/google';

export const gemini = defineGemini({
  root: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  },
  embedding: {
    outputDimensionality: 768,
  },
});
