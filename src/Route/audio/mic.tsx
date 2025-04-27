import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import MicPage from "../../pages/Audio/Mic";

export const audioMicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio/mic',
  component: MicPage,
}); 
