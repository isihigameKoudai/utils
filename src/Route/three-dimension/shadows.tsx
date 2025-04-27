import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import Shadows from '../../pages/ThreeDimension/Shadows';

export const shadowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/shadows',
  component: Shadows,
}); 
