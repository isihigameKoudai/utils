import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import ThreeDimension from "../../pages/ThreeDimension";

export const threeDimensionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension',
  component: ThreeDimension,
}); 
