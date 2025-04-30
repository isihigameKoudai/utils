import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import AudioPage from "../../pages/Audio";

export const audioRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/audio',
  component: AudioPage,
}); 
