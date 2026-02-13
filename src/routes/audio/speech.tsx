import { createFileRoute } from '@tanstack/react-router';

import Speech from '@/src/features/Audio/pages/SpeechPage';

export const Route = createFileRoute('/audio/speech')({
  component: Speech,
});
