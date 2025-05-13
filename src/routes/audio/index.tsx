import { createFileRoute } from '@tanstack/react-router'

import AudioPage from '@/src/pages/Audio';

export const Route = createFileRoute('/audio/')({
  component: AudioPage,
}) 
