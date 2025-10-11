import { createFileRoute } from '@tanstack/react-router';
import NormalCircle from '@/src/pages/Examples/NormalCircle';

export const Route = createFileRoute('/samples/normal-circle')({
  component: NormalCircle,
});
