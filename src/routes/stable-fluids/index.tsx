import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import StableFluids from "../../pages/StableFluids";

export const stableFluidsRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/stable-fluids',
  component: StableFluids,
}); 
