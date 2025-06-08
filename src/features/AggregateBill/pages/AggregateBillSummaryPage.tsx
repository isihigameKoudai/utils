import { useEffect, useState } from 'react';
import { styled } from '@/utils/ui/styled';
import { BillSummaryStore } from '../stores/billSummaryStore';
import { BillTable } from '../components/BillTable';
import type { SortKey } from '../stores/type';

const Container = styled('div')({
  padding: '2rem',
  height: '100dvh',
  boxSizing: 'border-box',
});

const SummarySection = styled('div')({
  marginTop: '2rem',
  padding: '1rem',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
});

const AggregateBillSummaryPage = () => {
  const { queries, actions } = BillSummaryStore.useStore();

  useEffect(() => {
    actions.loadSummaryRecords();
  }, []);

  const handleSort = (key: SortKey) => {
    const newOrder = key === queries.sort.target && queries.sort.order === 'asc' ? 'desc' : 'asc';
    actions.setSort({
      target: key,
      order: newOrder,
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
  };

  if (queries.isEmptySummaryRecords) {
    return <div>データがありません</div>;
  }

  return (
    <Container>
      <h2>集計結果一覧</h2>
      <BillTable
        bills={queries.summaryRecords}
        sortKey={queries.sort.target}
        sortOrder={queries.sort.order}
        onSort={handleSort}
        formatAmount={formatAmount}
      />
    </Container>
  );
};

export default AggregateBillSummaryPage;
