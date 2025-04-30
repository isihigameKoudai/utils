import { createRoute } from '@tanstack/react-router';
import { RootLayout } from '../__root';
import MultiChartPage from "../../pages/CryptoCharts/multi";

export const multiChartRoute = createRoute({
  getParentRoute: () => RootLayout,
  path: '/crypto-charts/multi/$token',
  component: MultiChartPage,
}); 
