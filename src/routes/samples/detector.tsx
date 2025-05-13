import { createFileRoute } from '@tanstack/react-router'
import Detector from '@/src/pages/Examples/Detector'

export const Route = createFileRoute('/samples/detector')({
  component: Detector,
}) 
