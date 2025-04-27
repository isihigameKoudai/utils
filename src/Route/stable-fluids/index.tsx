import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import StableFluids from "../../pages/StableFluids";

export const stableFluidsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stable-fluids',
  component: StableFluids,
}); 
