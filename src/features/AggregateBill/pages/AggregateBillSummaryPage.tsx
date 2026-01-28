import { styled } from '@/utils/styled';

import { BillBarChart } from '../components/BillBarChart';
import { BillList } from '../components/BillList';
import { Header } from '../components/Header';
import { BillSummaryStore } from '../stores/billSummaryStore';

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
  $nest: {
    '&.active': {
      backgroundColor: '#2c5282',
    },
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

  const handleGroupingChange = (type: 'none' | 'store' | 'month') => {
    actions.setGroupingType(type);
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
            onClick={() => handleGroupingChange('none')}
            className={queries.groupingType === 'none' ? 'active' : ''}
          >
            個別表示
          </Button>
          <Button
            type="button"
            onClick={() => handleGroupingChange('store')}
            className={queries.groupingType === 'store' ? 'active' : ''}
          >
            店舗ごとに集計
          </Button>
          <Button
            type="button"
            onClick={() => handleGroupingChange('month')}
            className={queries.groupingType === 'month' ? 'active' : ''}
          >
            月ごとに集計
          </Button>
        </ButtonGroup>
        {queries.isEmptySummaryRecords ? (
          <div>データがありません</div>
        ) : (
          <>
            <BillBarChart
              bills={queries.summaryRecords}
              groupingType={queries.groupingType}
            />
            <BillList bills={queries.summaryRecords} />
          </>
        )}
      </Container>
    </>
  );
};

export default AggregateBillSummaryPage;
