import { createFileRoute } from '@tanstack/react-router';
import ShadowsPage from '@/src/features/ThreeDimension/pages/ShadowsPage';

export const Route = createFileRoute('/three-dimension/shadows')({
  component: ShadowsPage,
});
