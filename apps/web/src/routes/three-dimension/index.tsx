import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/three-dimension/')({
	beforeLoad: () => {
		throw redirect({
			to: '/three-dimension/shadows',
		});
	},
});
