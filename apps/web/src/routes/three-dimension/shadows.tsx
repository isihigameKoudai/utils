import { createFileRoute } from '@tanstack/react-router';

import ShadowsPage from '@/features/ThreeDimension/pages/ShadowsPage';

export const Route = createFileRoute('/three-dimension/shadows')({
	component: ShadowsPage,
});
