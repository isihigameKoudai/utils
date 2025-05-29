import { styled } from '@/utils/ui/styled';
import type { ListItem } from '@/utils/array/array';

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

type SummaryTableProps = {
  title: string;
  headers: string[];
  data: ListItem[];
  formatValue?: (value: number) => string;
};

export const SummaryTable = ({ title, headers, data, formatValue = (value) => `${value}円` }: SummaryTableProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <Table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <Td>{item.key}</Td>
              <Td>{formatValue(item.value)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}; 
