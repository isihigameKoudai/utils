import { createFileRoute } from '@tanstack/react-router';

import FollowerCirclePage from '@/src/features/Shader/pages/FollowerCirclePage';

export const Route = createFileRoute('/samples/follower-circle')({
  component: FollowerCirclePage,
});
