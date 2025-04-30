import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import ShaderPage from '../../pages/ThreeDimension/Shader';

export const shaderPageRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/three-dimension/shader',
  component: ShaderPage,
}); 
