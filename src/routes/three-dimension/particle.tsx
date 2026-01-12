import { createFileRoute } from '@tanstack/react-router';
import ParticlePage from '@/src/features/ThreeDimension/pages/ParticlePage';

export const Route = createFileRoute('/three-dimension/particle')({
  component: ParticlePage,
});
