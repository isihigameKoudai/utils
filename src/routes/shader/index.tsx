import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import Shader from "../../pages/shader";

export const shaderRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/shader',
  component: Shader,
}); 
