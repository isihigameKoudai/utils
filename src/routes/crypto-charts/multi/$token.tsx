import { createFileRoute } from '@tanstack/react-router'
import MultiChart from '@/src/pages/CryptoCharts/multi'

export const Route = createFileRoute('/crypto-charts/multi/$token')({
  component: MultiChart,
}) 
