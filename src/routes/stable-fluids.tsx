import { createFileRoute } from '@tanstack/react-router'
import StableFluids from '../pages/StableFluids'

export const Route = createFileRoute('/stable-fluids')({
  component: StableFluids,
}) 
