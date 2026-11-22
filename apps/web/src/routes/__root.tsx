import {
	createRootRoute,
	lazyRouteComponent,
	Outlet,
} from '@tanstack/react-router';

import { RootLayout } from '../components/RootLayout';

const TanStackRouterDevtools = import.meta.env.DEV
	? lazyRouteComponent(
			() => import('@tanstack/router-devtools'),
			'TanStackRouterDevtools',
		)
	: () => null;

export const Route = createRootRoute({
	component: () => (
		<>
			<RootLayout>
				<Outlet />
			</RootLayout>
			<TanStackRouterDevtools />
		</>
	),
});
