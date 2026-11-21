import { createFileRoute } from '@tanstack/react-router';

import CellularNoise from '@/features/Noise/CellularNoise';

export const Route = createFileRoute('/noise/cellular')({
	component: CellularNoise,
});
