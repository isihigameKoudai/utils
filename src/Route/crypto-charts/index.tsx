import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import CryptoCharts from "../../pages/CryptoCharts";

export const cryptoChartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crypto-charts',
  component: CryptoCharts,
}); 
