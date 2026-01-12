import { createFileRoute } from '@tanstack/react-router';
import ShaderPage from '@/src/features/Shader/pages/ShaderPage';

export const Route = createFileRoute('/shader')({
  component: ShaderPage,
});
