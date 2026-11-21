import { createFileRoute } from '@tanstack/react-router';

import { GeminiEmbeddingPage } from '@/features/GeminiEmbedding/pages/GeminiEmbeddingPage';

export const Route = createFileRoute('/gemini-embedding')({
	component: GeminiEmbeddingPage,
});
