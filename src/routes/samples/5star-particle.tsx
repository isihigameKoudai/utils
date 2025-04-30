import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '@/src/routes/__root';
import FivePointCirclePage from "../../pages/Examples/FivePointCircle";

export const fivePointCircleRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/samples/5star-particle',
  component: FivePointCirclePage,
}); 
