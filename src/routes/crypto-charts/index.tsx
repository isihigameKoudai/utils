import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '@/src/routes/__root';
import CryptoCharts from "@/src/pages/CryptoCharts";

export const Route = createRoute({
  getParentRoute: () => RootLayout,
  path: '/crypto-charts/',
  component: CryptoCharts,
}); 
