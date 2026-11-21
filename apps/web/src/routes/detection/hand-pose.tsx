import { createFileRoute } from '@tanstack/react-router';

import HandPoseDetectionPage from '@/features/Detection/pages/HandPoseDetectionPage';

export const Route = createFileRoute('/detection/hand-pose')({
	component: HandPoseDetectionPage,
});
