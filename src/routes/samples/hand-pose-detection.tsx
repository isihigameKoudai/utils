import { createFileRoute } from '@tanstack/react-router';
import HandPoseDetection from '@/src/pages/Examples/HandPoseDetection';

export const Route = createFileRoute('/samples/hand-pose-detection')({
  component: HandPoseDetection,
});
