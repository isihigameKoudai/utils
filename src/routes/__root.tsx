import { createRootRoute, Outlet } from '@tanstack/react-router'
import { RootLayout } from '../components/RootLayout'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <RootLayout>
        <Outlet />
      </RootLayout>
      <TanStackRouterDevtools />
    </>
  ),
}) 
