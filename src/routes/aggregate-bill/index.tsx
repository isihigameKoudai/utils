import { createFileRoute } from '@tanstack/react-router';
import { BillListPage } from '../../features/AggregateBill/pages/BillListPage';

export const Route = createFileRoute('/aggregate-bill/')({
  component: BillListPage,
});
