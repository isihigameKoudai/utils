import { createFileRoute } from '@tanstack/react-router';

import FluidDetectPage from '@/src/features/Detection/pages/FluidDetectPage';

export const Route = createFileRoute('/detection/fluid')({
  component: FluidDetectPage,
});
