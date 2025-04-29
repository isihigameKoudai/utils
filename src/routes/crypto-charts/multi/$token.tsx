import { createFileRoute } from '@tanstack/react-router';
import MultiChartPage from "@/src/pages/CryptoCharts/multi";

export const Route = createFileRoute('/crypto-charts/multi/$token')({
  component: MultiChartPage,
}); 
