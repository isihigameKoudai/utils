import { Bill } from '../models/Bill';
import { styled } from '@/utils/ui/styled';

const Table = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '1rem',
});

const Th = styled('th')({
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '2px solid #e0e0e0',
  backgroundColor: '#f5f5f5',
});

const Td = styled('td')({
  padding: '0.75rem',
  borderBottom: '1px solid #e0e0e0',
});

type Props = {
  bills: Bill[];
};

export const BillList = ({ bills }: Props) => {
  if (bills.length === 0) {
    return <p>集計データがありません。CSVを取り込んで集計を実行してください。</p>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>日付</Th>
          <Th>金額</Th>
          <Th>店舗</Th>
        </tr>
      </thead>
      <tbody>
        {bills.map((bill, index) => (
          <tr key={index}>
            <Td>{bill.dateLabel}</Td>
            <Td>{bill.amountLabel}</Td>
            <Td>{bill.store}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}; 
