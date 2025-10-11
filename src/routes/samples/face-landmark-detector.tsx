import { createFileRoute } from '@tanstack/react-router';
import FaceLandmarkDetector from '@/src/pages/Examples/FaceLandmarkDetector';

export const Route = createFileRoute('/samples/face-landmark-detector')({
  component: FaceLandmarkDetector,
});
