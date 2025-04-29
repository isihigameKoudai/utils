import { createFileRoute } from '@tanstack/react-router';
import CryptoCharts from "@/src/pages/CryptoCharts";

export const Route = createFileRoute('/crypto-charts/')({
  component: CryptoCharts,
}); 
