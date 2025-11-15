import { createFileRoute } from '@tanstack/react-router';
import MeltTheBorder from '../pages/MeltTheBorder';

export const Route = createFileRoute('/melt-the-border')({
  component: MeltTheBorder,
});
