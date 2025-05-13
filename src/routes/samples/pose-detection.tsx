import { createFileRoute } from '@tanstack/react-router'
import PoseDetection from '@/src/pages/Examples/PoseDetection'

export const Route = createFileRoute('/samples/pose-detection')({
  component: PoseDetection,
}) 
