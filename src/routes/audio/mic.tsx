import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import MicPage from "../../pages/Audio/Mic";

export const audioMicRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/audio/mic',
  component: MicPage,
}); 
