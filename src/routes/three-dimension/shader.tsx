import { createFileRoute } from '@tanstack/react-router';
import Shader from '@/src/pages/ThreeDimension/Shader';

export const Route = createFileRoute('/three-dimension/shader')({
  component: Shader,
});
