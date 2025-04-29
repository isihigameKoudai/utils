import { createRoute } from '@tanstack/react-router';
import MultiChartPage from "@/src/pages/CryptoCharts/multi";
import { RootLayout } from '@/src/routes/__root';

export const Route = createRoute({
  getParentRoute: () => RootLayout,
  path: '/crypto-charts/multi/$token',
  component: MultiChartPage,
}); 
