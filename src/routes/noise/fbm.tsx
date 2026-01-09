import { createFileRoute } from '@tanstack/react-router';
import Fbm from '@/src/features/Noise/Fbm';

export const Route = createFileRoute('/noise/fbm')({
  component: Fbm,
});
