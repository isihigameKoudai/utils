import { createFileRoute } from '@tanstack/react-router';
import Shader from '../pages/shader';

export const Route = createFileRoute('/shader')({
  component: Shader,
});
