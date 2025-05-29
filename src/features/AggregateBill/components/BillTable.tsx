import { styled } from '@/utils/ui/styled';
import { Bill } from '../models/Bill';

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
});

const Th = styled('th')({
  padding: '0.5rem',
  border: '1px solid #e0e0e0',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  $nest: {
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
} as const);

const Td = styled('td')({
  padding: '0.5rem',
  border: '1px solid #e0e0e0',
  textAlign: 'right',
});

type SortKey = 'date' | 'store' | 'amount';
type SortOrder = 'asc' | 'desc';

type BillTableProps = {
  bills: Bill[];
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
  formatAmount: (amount: number) => string;
};

export const BillTable = ({ bills, sortKey, sortOrder, onSort, formatAmount }: BillTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <Th onClick={() => onSort('date')}>
            日付 {sortKey === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Th>
          <Th onClick={() => onSort('store')}>
            店舗 {sortKey === 'store' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Th>
          <Th onClick={() => onSort('amount')}>
            金額 {sortKey === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Th>
        </tr>
      </thead>
      <tbody>
        {bills.map((bill, index) => (
          <tr key={index}>
            <Td>{bill.date.format('YYYY-MM-DD')}</Td>
            <Td>{bill.store}</Td>
            <Td>{formatAmount(bill.amount)}円</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}; 
