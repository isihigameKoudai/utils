import { createFileRoute } from '@tanstack/react-router';
import StableFluidsPage from '@/src/features/StableFluids/pages/StableFluidsPage';

export const Route = createFileRoute('/stable-fluids')({
  component: StableFluidsPage,
});
