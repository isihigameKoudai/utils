import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { RootLayout } from '../components/RootLayout';

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
