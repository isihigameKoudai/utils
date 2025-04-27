import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import ParticlePage from '../../pages/ThreeDimension/Particle';

export const particlePageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/particle',
  component: ParticlePage,
}); 
