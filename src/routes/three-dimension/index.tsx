import { createFileRoute } from '@tanstack/react-router';

import BoxPage from '@/src/features/ThreeDimension/pages/BoxPage';

export const Route = createFileRoute('/three-dimension/')({
  component: BoxPage,
});
