import { createFileRoute } from '@tanstack/react-router'
import FluidDetect from '@/src/pages/Examples/FluidDetect'

export const Route = createFileRoute('/samples/fluid-detect')({
  component: FluidDetect,
}) 
