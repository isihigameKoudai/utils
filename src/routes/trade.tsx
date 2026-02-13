import { createFileRoute } from '@tanstack/react-router';

import { TradePage } from '../features/Crypto/pages/Trade';

export const Route = createFileRoute('/trade')({
  component: TradePage,
});
