import { createFileRoute } from '@tanstack/react-router';

import Fractal from '@/features/Noise/Fractal';

export const Route = createFileRoute('/noise/fractal')({
	component: Fractal,
});
