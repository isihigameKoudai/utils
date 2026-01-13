import { createFileRoute } from '@tanstack/react-router';

import SquareSparkPage from '@/src/features/Shader/pages/SquareSparkPage';

export const Route = createFileRoute('/samples/square-apark')({
  component: SquareSparkPage,
});
