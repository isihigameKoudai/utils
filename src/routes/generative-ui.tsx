import { createFileRoute } from '@tanstack/react-router';

import { GenerativeUIPage } from '@/src/features/GenerativeUI/pages/GenerativeUIPage';

export const Route = createFileRoute('/generative-ui')({
	component: GenerativeUIPage,
});
