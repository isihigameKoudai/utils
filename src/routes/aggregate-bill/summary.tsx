import { createFileRoute } from '@tanstack/react-router';

import AggregateBillSummaryPage from '../../features/AggregateBill/pages/AggregateBillSummaryPage';

export const Route = createFileRoute('/aggregate-bill/summary')({
  component: AggregateBillSummaryPage,
});
