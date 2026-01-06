/**
 * BillBarChart/types.ts
 * 棒グラフコンポーネントで使用する型定義
 */

import { Bill } from '../../models/Bill';

/** ソート順序の型 */
export type SortOrder = 'none' | 'asc' | 'desc';

/** グラフ表示用のデータ型 */
export type ChartDataItem = {
  name: string;
  amount: number;
  originalIndex: number;
};

/** BillBarChartコンポーネントのProps */
export type Props = {
  bills: Bill[];
  groupingType: 'none' | 'store' | 'month';
};
