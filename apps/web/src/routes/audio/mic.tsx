import { createFileRoute } from '@tanstack/react-router';

import Mic from '@/features/Audio/pages/MicPage';

export const Route = createFileRoute('/audio/mic')({
	component: Mic,
});
