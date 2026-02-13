import { createFileRoute } from '@tanstack/react-router';

import DetectorPage from '@/src/features/Detection/pages/DetectorPage';

export const Route = createFileRoute('/detection/detector')({
  component: DetectorPage,
});
