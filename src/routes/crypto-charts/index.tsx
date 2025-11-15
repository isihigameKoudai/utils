import { createFileRoute } from '@tanstack/react-router';
import CryptoCharts from '../../features/CryptoCharts/pages/CryptoCharts';

export const Route = createFileRoute('/crypto-charts/')({
  component: CryptoCharts,
});
