import { createFileRoute } from '@tanstack/react-router';

import MeltTheBorderPage from '@/features/MeltTheBorder/pages/MeltTheBorderPage';

export const Route = createFileRoute('/melt-the-border')({
	component: MeltTheBorderPage,
});
