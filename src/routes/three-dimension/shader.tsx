import { createFileRoute } from '@tanstack/react-router';

import ShaderPage from '@/src/features/ThreeDimension/pages/ShaderPage';

export const Route = createFileRoute('/three-dimension/shader')({
  component: ShaderPage,
});
