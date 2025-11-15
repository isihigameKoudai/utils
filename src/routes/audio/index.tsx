import { createFileRoute } from '@tanstack/react-router';
import Audio from '@/src/pages/Audio';

export const Route = createFileRoute('/audio/')({
  component: Audio,
});
