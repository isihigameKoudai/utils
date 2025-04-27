import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './routeConfig';
import Index from "../pages";

// ルート定義を作成
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
}); 
