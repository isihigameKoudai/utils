import { createFileRoute } from '@tanstack/react-router'
import AudioCircle from '@/src/pages/Examples/AudioCircle'

export const Route = createFileRoute('/samples/audio-circle')({
  component: AudioCircle,
}) 
