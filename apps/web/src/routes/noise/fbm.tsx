import { createFileRoute } from '@tanstack/react-router';

import Fbm from '@/features/Noise/Fbm';

export const Route = createFileRoute('/noise/fbm')({
	component: Fbm,
});
