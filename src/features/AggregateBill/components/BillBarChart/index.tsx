/**
 * BillBarChart/index.tsx
 * 請求書データを棒グラフで表示するコンポーネント
 * 金額のソートと上位20%のハイライト表示機能を提供
 */

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

import {
  BOTTOM_80_COLOR,
  CHART_MARGIN,
  LEGEND_COLOR_STYLE,
  SORT_ORDER_LABELS,
  SORT_ORDER_OPTIONS,
  TOP_20_COLOR,
} from './constants';
import { useBillChartData, useTop20Indices } from './hooks';
import {
  ChartContainer,
  ChartWrapper,
  Legend,
  LegendItem,
  SortButton,
  SortControls,
} from './styles';
import type { Props, SortOrder } from './types';

/**
 * 請求書データを棒グラフで表示
 * @param bills - 表示する請求書データ
 * @param groupingType - データのグルーピング方法
 */
export const BillBarChart = ({ bills, groupingType }: Props) => {
  const { data, sortOrder, setSortOrder } = useBillChartData(
    bills,
    groupingType,
  );
  const top20Indices = useTop20Indices(data, sortOrder);

  // データが空の場合は何も表示しない
  if (bills.length === 0) {
    return null;
  }

  /**
   * インデックスに応じたバーの色を取得
   * ソート中は上位20%を強調色で表示
   */
  const getBarColor = (index: number): string => {
    if (sortOrder === 'none') {
      return BOTTOM_80_COLOR;
    }
    return top20Indices.has(index) ? TOP_20_COLOR : BOTTOM_80_COLOR;
  };

  return (
    <ChartWrapper>
      {/* ソートコントロール */}
      <SortControls>
        {SORT_ORDER_OPTIONS.map((order) => (
          <SortButton
            key={order}
            data-active={sortOrder === order}
            onClick={() => setSortOrder(order as SortOrder)}
          >
            {SORT_ORDER_LABELS[order]}
          </SortButton>
        ))}
      </SortControls>

      {/* メインチャート */}
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={CHART_MARGIN}>
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

      {/* 凡例（ソート有効時のみ表示） */}
      {sortOrder !== 'none' && (
        <Legend>
          <LegendItem>
            <span
              style={{ ...LEGEND_COLOR_STYLE, backgroundColor: TOP_20_COLOR }}
            />
            <span>上位20%</span>
          </LegendItem>
          <LegendItem>
            <span
              style={{
                ...LEGEND_COLOR_STYLE,
                backgroundColor: BOTTOM_80_COLOR,
              }}
            />
            <span>下位80%</span>
          </LegendItem>
        </Legend>
      )}
    </ChartWrapper>
  );
};
