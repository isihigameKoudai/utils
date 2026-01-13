import { createFileRoute } from '@tanstack/react-router';

import Mic from '@/src/features/Audio/pages/MicPage';

export const Route = createFileRoute('/audio/mic')({
  component: Mic,
});
