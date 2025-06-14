import { useEffect, useState } from 'react';
import { styled } from '@/utils/ui/styled';
import { BillSummaryStore } from '../stores/billSummaryStore';
import type { SortKey } from '../stores/type';
import { Header } from '../components/Header';
import { BillList } from '../components/BillList';

const Container = styled('div')({
  padding: '2rem',
  height: '100dvh',
  boxSizing: 'border-box',
});

const ButtonGroup = styled('div')({
  display: 'flex',
  gap: '1rem',
  marginBottom: '1rem',
});

const Button = styled('button')({
  padding: '0.5rem 1rem',
  backgroundColor: '#4a90e2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  '&.active': {
    backgroundColor: '#2c5282',
  },
});

const AggregateBillSummaryPage = () => {
  const { queries, actions } = BillSummaryStore.useStore();

  const handleImport = async () => {
    try {
      await actions.loadSummaryRecords();
    } catch (error) {
      console.error('CSVファイルの読み込みに失敗しました:', error);
    }
  };

  const handleToggleGrouping = () => {
    actions.toggleGrouping();
  };

  return (
    <>
      <Header />
      <Container>
        <h2>集計結果一覧</h2>
        <ButtonGroup>
          <Button type="button" onClick={handleImport}>
            CSVファイルを読み込む
          </Button>
          <Button 
            type="button" 
            onClick={handleToggleGrouping}
            className={queries.isGrouped ? 'active' : ''}
          >
            {queries.isGrouped ? '個別表示' : '名前ごとに集計'}
          </Button>
        </ButtonGroup>
        {
          queries.isEmptySummaryRecords ? (
            <div>データがありません</div>
          ) : (
            <BillList bills={queries.summaryRecords} />
          )
        }
      </Container>
    </>
  );
};

export default AggregateBillSummaryPage;
