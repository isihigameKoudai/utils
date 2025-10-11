import { createFileRoute } from '@tanstack/react-router';
import Particle from '@/src/pages/ThreeDimension/Particle';

export const Route = createFileRoute('/three-dimension/particle')({
  component: Particle,
});
