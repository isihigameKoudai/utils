import { createFileRoute } from '@tanstack/react-router';

import GeminiEmbeddingPage from '@/src/features/GeminiEmbedding/pages/GeminiEmbeddingPage';

export const Route = createFileRoute('/gemini-embedding')({
  component: GeminiEmbeddingPage,
});
