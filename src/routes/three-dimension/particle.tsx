import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import ParticlePage from '../../pages/ThreeDimension/Particle';

export const particlePageRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/three-dimension/particle',
  component: ParticlePage,
}); 
