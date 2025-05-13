import { createFileRoute } from '@tanstack/react-router'
import Fractal from '@/src/pages/Noise/Fractal'

export const Route = createFileRoute('/noise/fractal')({
  component: Fractal,
}) 
