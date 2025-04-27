import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import Shader from "../../pages/shader";

export const shaderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shader',
  component: Shader,
}); 
