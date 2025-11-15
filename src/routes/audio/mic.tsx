import { createFileRoute } from '@tanstack/react-router';
import Mic from '@/src/pages/Audio/Mic';

export const Route = createFileRoute('/audio/mic')({
  component: Mic,
});
