import { Bill } from '../models/Bill';
import { styled } from '@/utils/ui/styled';
import { useState, useMemo } from 'react';

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
});

const Th = styled('th')({
  padding: '8px 12px',
  textAlign: 'left',
  borderBottom: '2px solid #e0e0e0',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  userSelect: 'none',
  $nest: {
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
});

const ThCheckbox = styled('th')({
  padding: '8px 12px',
  textAlign: 'center',
  borderBottom: '2px solid #e0e0e0',
  backgroundColor: '#f5f5f5',
  width: '40px',
});

const Tr = styled('tr')({
  $nest: {
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
});

const TrChecked = styled('tr')({
  backgroundColor: '#e3f2fd',
  $nest: {
    '&:hover': {
      backgroundColor: '#bbdefb',
    },
  },
});

const Td = styled('td')({
  padding: '0.75rem',
  borderBottom: '1px solid #e0e0e0',
});

const TdCheckbox = styled('td')({
  padding: '0.75rem',
  borderBottom: '1px solid #e0e0e0',
  textAlign: 'center',
});

const Checkbox = styled('input')({
  width: '18px',
  height: '18px',
  cursor: 'pointer',
});

const SelectedTotal = styled('div')({
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: '#e3f2fd',
  borderRadius: '8px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

type SortKey = 'date' | 'amount' | 'store';
type SortOrder = 'asc' | 'desc';

type Props = {
  bills: Bill[];
};

export const BillList = ({ bills }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedBills = bills.sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    switch (sortKey) {
      case 'date':
        return multiplier * (a.date.unix() - b.date.unix());
      case 'amount':
        return multiplier * (a.amount - b.amount);
      case 'store':
        return multiplier * a.store.localeCompare(b.store);
      default:
        return 0;
    }
  });

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return '';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (checkedIndices.size === sortedBills.length) {
      setCheckedIndices(new Set());
    } else {
      setCheckedIndices(new Set(sortedBills.map((_, i) => i)));
    }
  };

  const isAllSelected = checkedIndices.size === sortedBills.length;
  const hasSelection = checkedIndices.size > 0;

  const selectedTotal = useMemo(() => {
    return sortedBills
      .filter((_, index) => checkedIndices.has(index))
      .reduce((acc, bill) => acc + bill.amount, 0);
  }, [sortedBills, checkedIndices]);

  const totalAmount = sortedBills.reduce((acc, bill) => acc + bill.amount, 0);

  if (bills.length === 0) {
    return (
      <p>集計データがありません。CSVを取り込んで集計を実行してください。</p>
    );
  }

  return (
    <>
      {hasSelection && (
        <SelectedTotal>
          <span>選択中: {checkedIndices.size}件</span>
          <span>選択合計: ¥{selectedTotal.toLocaleString()}</span>
        </SelectedTotal>
      )}
      <Table>
        <thead>
          <tr>
            <ThCheckbox>
              <Checkbox
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                title={isAllSelected ? '全て解除' : '全て選択'}
              />
            </ThCheckbox>
            <Th onClick={() => handleSort('date')}>
              日付{getSortIndicator('date')}
            </Th>
            <Th
              onClick={() => handleSort('amount')}
              style={{ textAlign: 'right' }}
            >
              金額{getSortIndicator('amount')}
            </Th>
            <Th onClick={() => handleSort('store')}>
              店舗{getSortIndicator('store')}
            </Th>
          </tr>
        </thead>
        <tbody>
          {sortedBills.map((bill, index) => {
            const isChecked = checkedIndices.has(index);
            const RowComponent = isChecked ? TrChecked : Tr;
            return (
              <RowComponent key={index}>
                <TdCheckbox>
                  <Checkbox
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </TdCheckbox>
                <Td>{bill.dateLabel}</Td>
                <Td style={{ textAlign: 'right' }}>{bill.amountLabel}</Td>
                <Td>{bill.store}</Td>
              </RowComponent>
            );
          })}
          <Tr style={{ backgroundColor: '#eee', borderTop: '2px solid #aaa' }}>
            <Td></Td>
            <Td>合計</Td>
            <Td style={{ textAlign: 'right' }}>
              {totalAmount.toLocaleString()}
            </Td>
            <Td></Td>
          </Tr>
        </tbody>
      </Table>
    </>
  );
};
