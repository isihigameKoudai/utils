import { createFileRoute } from '@tanstack/react-router';
import FivePointCirclePage from '@/src/features/Shader/pages/FivePointCirclePage';

export const Route = createFileRoute('/samples/5star-particle')({
  component: FivePointCirclePage,
});
