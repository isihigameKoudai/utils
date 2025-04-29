import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '@/src/routes/__root';
import ThreeDimension from "../../pages/ThreeDimension";

export const threeDimensionRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/three-dimension',
  component: ThreeDimension,
}); 
