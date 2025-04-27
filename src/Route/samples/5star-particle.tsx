import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import FivePointCirclePage from "../../pages/Examples/FivePointCircle";

export const fivePointCircleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/samples/5star-particle',
  component: FivePointCirclePage,
}); 
