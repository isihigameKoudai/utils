import { createFileRoute } from '@tanstack/react-router';

import PlaygroundPage from '@/features/Playground/pages/PlaygroundPage';

export const Route = createFileRoute('/playground')({
	component: PlaygroundPage,
});
