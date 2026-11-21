import { createFileRoute } from '@tanstack/react-router';

import FaceLandmarkDetectorPage from '@/features/Detection/pages/FaceLandmarkDetectorPage';

export const Route = createFileRoute('/detection/face-landmark')({
	component: FaceLandmarkDetectorPage,
});
