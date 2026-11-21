import { createFileRoute } from '@tanstack/react-router';

import Audio from '@/features/Audio/pages/AudioPage';

export const Route = createFileRoute('/audio/')({
	component: Audio,
});
