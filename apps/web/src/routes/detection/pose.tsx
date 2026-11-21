import { createFileRoute } from '@tanstack/react-router';

import PoseDetectionPage from '@/features/Detection/pages/PoseDetectionPage';

export const Route = createFileRoute('/detection/pose')({
	component: PoseDetectionPage,
});
