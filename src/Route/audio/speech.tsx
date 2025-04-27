import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import SpeechPage from "../../pages/Audio/Speech";

export const audioSpeechRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/audio/speech',
  component: SpeechPage,
}); 
