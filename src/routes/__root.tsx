import React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { NavigationHeader } from "./NavigationLayout";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const RootLayout = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <NavigationHeader />
      {/* <TanStackRouterDevtools /> */}
    </>
  )
}); 
