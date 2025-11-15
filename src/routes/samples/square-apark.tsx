import { createFileRoute } from '@tanstack/react-router';
import SquareSpark from '@/src/pages/Examples/SquareSpark';

export const Route = createFileRoute('/samples/square-apark')({
  component: SquareSpark,
});
