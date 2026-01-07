import { createFileRoute } from '@tanstack/react-router';
import Fractal from '@/src/features/Noise/Fractal';

export const Route = createFileRoute('/noise/fractal')({
  component: Fractal,
});
