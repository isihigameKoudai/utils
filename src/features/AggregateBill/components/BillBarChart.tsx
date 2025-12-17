import { useState, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Bill } from '../models/Bill';
import { styled } from '@/utils/ui/styled';

// 上位20%の色（強調色）
const TOP_20_COLOR = '#ff7300';
// 下位80%の色（通常色）
const BOTTOM_80_COLOR = '#8884d8';

const ChartWrapper = styled('div')({
  marginBottom: '2rem',
});

const SortControls = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '0.5rem',
  gap: '0.5rem',
});

const SortButton = styled('button')({
  padding: '0.25rem 0.75rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'background-color 0.2s, border-color 0.2s',
  $nest: {
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    '&[data-active="true"]': {
      backgroundColor: '#8884d8',
      color: '#fff',
      borderColor: '#8884d8',
    },
    '&[data-active="true"]:hover': {
      backgroundColor: '#7773c7',
    },
  },
});

const ChartContainer = styled('div')({
  height: 400,
  width: '100%',
});

const Legend = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '1.5rem',
  marginTop: '0.5rem',
  fontSize: '0.875rem',
});

const LegendItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

const LegendColorStyle = {
  display: 'inline-block',
  width: '16px',
  height: '16px',
  borderRadius: '2px',
} as const;

type SortOrder = 'none' | 'asc' | 'desc';

type Props = {
  bills: Bill[];
  groupingType: 'none' | 'store' | 'month';
};

export const BillBarChart = ({ bills, groupingType }: Props) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

  const data = useMemo(() => {
    const mapped = bills.map((bill, index) => {
      let name = '';
      switch (groupingType) {
        case 'store':
          name = bill.store;
          break;
        case 'month':
          name = bill.date.format('YYYY-MM');
          break;
        default:
          name = `${bill.date.format('MM/DD')} ${bill.store}`;
          break;
      }

      return {
        name,
        amount: bill.amount,
        originalIndex: index,
      };
    });

    if (sortOrder === 'asc') {
      return [...mapped].sort((a, b) => a.amount - b.amount);
    }
    if (sortOrder === 'desc') {
      return [...mapped].sort((a, b) => b.amount - a.amount);
    }
    // 元の順序に戻す
    return [...mapped].sort((a, b) => a.originalIndex - b.originalIndex);
  }, [bills, groupingType, sortOrder]);

  // 上位20%のインデックスを計算（ソート時のみ有効）
  const top20Indices = useMemo(() => {
    if (sortOrder === 'none') return new Set<number>();

    // 金額で降順ソートしてインデックスを取得
    const sortedByAmount = [...data]
      .map((item, index) => ({ ...item, currentIndex: index }))
      .sort((a, b) => b.amount - a.amount);

    const top20Count = Math.ceil(data.length * 0.2);
    const top20Set = new Set<number>();

    for (let i = 0; i < top20Count; i++) {
      top20Set.add(sortedByAmount[i].currentIndex);
    }

    return top20Set;
  }, [data, sortOrder]);

  if (bills.length === 0) return null;

  const getSortLabel = (order: SortOrder) => {
    switch (order) {
      case 'asc':
        return '金額: 昇順 ↑';
      case 'desc':
        return '金額: 降順 ↓';
      default:
        return '元の順序';
    }
  };

  const getBarColor = (index: number) => {
    if (sortOrder === 'none') return BOTTOM_80_COLOR;
    return top20Indices.has(index) ? TOP_20_COLOR : BOTTOM_80_COLOR;
  };

  return (
    <ChartWrapper>
      <SortControls>
        {(['none', 'asc', 'desc'] as SortOrder[]).map((order) => (
          <SortButton
            key={order}
            data-active={sortOrder === order}
            onClick={() => setSortOrder(order)}
          >
            {getSortLabel(order)}
          </SortButton>
        ))}
      </SortControls>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}円`}
            />
            <Bar dataKey="amount" name="金額">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      {sortOrder !== 'none' && (
        <Legend>
          <LegendItem>
            <span
              style={{ ...LegendColorStyle, backgroundColor: TOP_20_COLOR }}
            />
            <span>上位20%</span>
          </LegendItem>
          <LegendItem>
            <span
              style={{ ...LegendColorStyle, backgroundColor: BOTTOM_80_COLOR }}
            />
            <span>下位80%</span>
          </LegendItem>
        </Legend>
      )}
    </ChartWrapper>
  );
};
