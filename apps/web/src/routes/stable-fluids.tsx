import { createFileRoute } from '@tanstack/react-router';

import StableFluidsPage from '@/features/StableFluids/pages/StableFluidsPage';

export const Route = createFileRoute('/stable-fluids')({
	component: StableFluidsPage,
});
