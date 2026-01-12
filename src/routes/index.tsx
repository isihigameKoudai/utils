import { createFileRoute } from '@tanstack/react-router';
import HomePage from '@/src/features/Home/pages/HomePage';

export const Route = createFileRoute('/')({
  component: HomePage,
});
