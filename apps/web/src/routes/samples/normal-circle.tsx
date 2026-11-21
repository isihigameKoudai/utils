import { createFileRoute } from '@tanstack/react-router';

import NormalCirclePage from '@/features/Shader/pages/NormalCirclePage';

export const Route = createFileRoute('/samples/normal-circle')({
	component: NormalCirclePage,
});
