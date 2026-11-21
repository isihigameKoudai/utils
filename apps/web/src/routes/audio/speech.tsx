import { createFileRoute } from '@tanstack/react-router';

import Speech from '@/features/Audio/pages/SpeechPage';

export const Route = createFileRoute('/audio/speech')({
	component: Speech,
});
