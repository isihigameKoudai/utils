import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import ShaderPage from '../../pages/ThreeDimension/Shader';

export const shaderPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/three-dimension/shader',
  component: ShaderPage,
}); 
