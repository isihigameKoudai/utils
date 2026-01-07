import { createFileRoute } from '@tanstack/react-router';
import CellularNoise from '@/src/features/Noise/CellularNoise';

export const Route = createFileRoute('/noise/cellular')({
  component: CellularNoise,
});
