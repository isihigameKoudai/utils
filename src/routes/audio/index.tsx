import { createFileRoute } from '@tanstack/react-router';

import Audio from '@/src/features/Audio/pages/AudioPage';

export const Route = createFileRoute('/audio/')({
  component: Audio,
});
