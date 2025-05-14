import { BillStore } from '../stores/billStore';
import { styled } from '@/utils/ui/styled';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Bill } from '../types/bill';

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  margin: '1rem 0'
});

const Th = styled('th')({
  padding: '0.5rem',
  border: '1px solid #ddd',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  $nest: {
    '&:hover': {
      backgroundColor: '#e5e5e5'
    }
  }
});

const Td = styled('td')({
  padding: '0.5rem',
  border: '1px solid #ddd'
});

const Button = styled('button')({
  padding: '0.25rem 0.5rem',
  backgroundColor: '#ff4444',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  $nest: {
    '&:hover': {
      backgroundColor: '#cc0000'
    }
  }
});

export const BillTable = () => {
  const { state, actions } = BillStore.useStore();
  const [sortField, setSortField] = useState<keyof Bill>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Bill) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBills = [...state.bills].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === 'asc' 
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });

  return (
    <Table>
      <thead>
        <tr>
          <Th onClick={() => handleSort('date')}>日付</Th>
          <Th onClick={() => handleSort('name')}>名称</Th>
          <Th onClick={() => handleSort('amount')}>金額</Th>
          <Th onClick={() => handleSort('brand')}>カード</Th>
          <Th>操作</Th>
        </tr>
      </thead>
      <tbody>
        {sortedBills.map(bill => (
          <tr key={bill.id}>
            <Td>{dayjs(bill.date).format('YYYY/MM/DD')}</Td>
            <Td>{bill.name}</Td>
            <Td>{bill.amount.toLocaleString()}円</Td>
            <Td>{bill.brand}</Td>
            <Td>
              <Button onClick={() => actions.removeBill(bill.id)}>
                削除
              </Button>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}; 
