import { createFileRoute } from '@tanstack/react-router';

import MultiChart from '../../../features/CryptoCharts/pages/MultiChart';

export const Route = createFileRoute('/crypto-charts/multi/$token')({
  component: MultiChart,
});
