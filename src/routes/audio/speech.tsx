import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import SpeechPage from "../../pages/Audio/Speech";

export const audioSpeechRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/audio/speech',
  component: SpeechPage,
}); 
