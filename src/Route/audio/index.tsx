import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import AudioPage from "../../pages/Audio";

export const audioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio',
  component: AudioPage,
}); 
