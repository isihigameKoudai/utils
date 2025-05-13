import { createFileRoute } from '@tanstack/react-router'

import MicPage from '@/src/pages/Audio/Mic';

export const Route = createFileRoute('/audio/mic')({
  component: MicPage,
});
