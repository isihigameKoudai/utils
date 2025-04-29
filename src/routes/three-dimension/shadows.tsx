import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import Shadows from '../../pages/ThreeDimension/Shadows';

export const shadowsRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/three-dimension/shadows',
  component: Shadows,
}); 
