import { useEffect } from 'react';

import { styled } from '@/src/shared/styled';

import { BillList } from '../components/BillList';
import { Header } from '../components/Header';
import { BRAND } from '../constants/brand';
import { BillStore } from '../stores/billStore';

const Container = styled('div')({
  display: 'flex',
  gap: '2rem',
  padding: '2rem',
  height: '100dvh',
  boxSizing: 'border-box',
});

const ImportArea = styled('div')({
  flex: '0 0 300px',
  padding: '1rem',
  borderRight: '1px solid #e0e0e0',
});

const ResultArea = styled('div')({
  flex: '1',
  padding: '1rem',
  overflow: 'auto',
});

const BrandFileOpener = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
});

const ImportButton = styled('button')({
  padding: '0.5rem 1rem',
  backgroundColor: '#4a90e2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
});

const ImportedLabel = styled('span')({
  color: '#4caf50',
  fontSize: '0.9rem',
});

const AggregateButton = styled('button')({
  padding: '0.5rem 1rem',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem',
  opacity: 1,
});

const SaveButton = styled('button')({
  padding: '0.5rem 1rem',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem',
  opacity: 1,
});

export const BillListPage = () => {
  const { queries, actions } = BillStore.useStore();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!queries.isEmptyTotalRecords) {
        e.preventDefault();
        e.returnValue = '';
      }
      return;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [queries.isEmptyTotalRecords]);

  return (
    <>
      <Header />
      <Container>
        <ImportArea>
          <h2>CSV取り込み</h2>
          {Object.values(BRAND).map((brand) => (
            <BrandFileOpener key={brand.value}>
              <ImportButton
                type="button"
                onClick={() => actions.fetchCSVFiles({ brand: brand.value })}
              >
                {brand.label}CSV取り込み
              </ImportButton>
              {queries[`${brand.value}Records`]?.value && (
                <ImportedLabel>✓ 取り込み済み</ImportedLabel>
              )}
            </BrandFileOpener>
          ))}
          <AggregateButton
            type="button"
            disabled={queries.isEmptyAllRecords}
            onClick={() => actions.adaptTotalRecords()}
            style={{ opacity: queries.isEmptyAllRecords ? 0.5 : 1 }}
          >
            集計実行
          </AggregateButton>
          <SaveButton
            type="button"
            disabled={queries.isEmptyTotalRecords}
            onClick={() => actions.saveTotalRecords()}
            style={{ opacity: queries.isEmptyTotalRecords ? 0.5 : 1 }}
          >
            集計結果を保存
          </SaveButton>
        </ImportArea>
        <ResultArea>
          <h2>集計結果</h2>
          <BillList bills={queries.totalRecords} />
        </ResultArea>
      </Container>
    </>
  );
};
