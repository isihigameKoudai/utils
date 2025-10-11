import { createFileRoute } from '@tanstack/react-router';
import FollowerCircle from '@/src/pages/Examples/FollowerCircle';

export const Route = createFileRoute('/samples/follower-circle')({
  component: FollowerCircle,
});
