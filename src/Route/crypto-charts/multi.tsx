import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../routeConfig';
import MultiChartPage from "../../pages/CryptoCharts/multi";

export const multiChartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crypto-charts/multi/$token',
  component: MultiChartPage,
}); 
