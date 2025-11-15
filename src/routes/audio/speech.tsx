import { createFileRoute } from '@tanstack/react-router';
import Speech from '@/src/pages/Audio/Speech';

export const Route = createFileRoute('/audio/speech')({
  component: Speech,
});
