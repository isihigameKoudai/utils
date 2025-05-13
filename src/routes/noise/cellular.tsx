import { createFileRoute } from '@tanstack/react-router'
import CellularNoise from '@/src/pages/Noise/CellularNoise'

export const Route = createFileRoute('/noise/cellular')({
  component: CellularNoise,
}) 
