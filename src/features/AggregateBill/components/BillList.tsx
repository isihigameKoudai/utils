import { Bill } from '../models/Bill';
import { styled } from '@/utils/ui/styled';
import { useState } from 'react';

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
    }
  }
});

const Td = styled('td')({
  padding: '0.75rem',
  borderBottom: '1px solid #e0e0e0',
});

type SortKey = 'date' | 'amount' | 'store';
type SortOrder = 'asc' | 'desc';

type Props = {
  bills: Bill[];
};

export const BillList = ({ bills }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  if (bills.length === 0) {
    return <p>集計データがありません。CSVを取り込んで集計を実行してください。</p>;
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedBills = [...bills].sort((a, b) => {
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

  return (
    <Table>
      <thead>
        <tr>
          <Th onClick={() => handleSort('date')}>日付{getSortIndicator('date')}</Th>
          <Th onClick={() => handleSort('amount')} style={{ textAlign: 'right' }}>金額{getSortIndicator('amount')}</Th>
          <Th onClick={() => handleSort('store')}>店舗{getSortIndicator('store')}</Th>
        </tr>
      </thead>
      <tbody>
        {sortedBills.map((bill, index) => (
          <tr key={index}>
            <Td>{bill.dateLabel}</Td>
            <Td style={{ textAlign: 'right' }}>{bill.amountLabel}</Td>
            <Td>{bill.store}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}; 
