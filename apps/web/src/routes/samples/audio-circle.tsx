import { createFileRoute } from '@tanstack/react-router';

import AudioCirclePage from '@/features/Shader/pages/AudioCirclePage';

export const Route = createFileRoute('/samples/audio-circle')({
	component: AudioCirclePage,
});
