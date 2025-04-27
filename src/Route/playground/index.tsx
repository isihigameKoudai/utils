import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import PlaygroundPage from "../../pages/Playground";

export const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/playground',
  component: PlaygroundPage,
}); 
