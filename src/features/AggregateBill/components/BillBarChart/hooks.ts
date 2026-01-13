/**
 * BillBarChart/hooks.ts
 * 棒グラフコンポーネントで使用するカスタムフック
 */

import { useMemo, useState } from 'react';

import type { Bill } from '../../models/Bill';

import { TOP_PERCENTAGE } from './constants';
import type { ChartDataItem, SortOrder } from './types';

/**
 * 請求書データをチャート表示用に変換し、ソート機能を提供するフック
 * @param bills - 請求書データの配列
 * @param groupingType - グルーピングの種類
 */
export const useBillChartData = (
  bills: Bill[],
  groupingType: 'none' | 'store' | 'month',
) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

  const data = useMemo<ChartDataItem[]>(() => {
    // 請求書データをチャート表示用の形式にマッピング
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

    // ソート順序に応じてデータを並び替え
    if (sortOrder === 'asc') {
      return [...mapped].sort((a, b) => a.amount - b.amount);
    }
    if (sortOrder === 'desc') {
      return [...mapped].sort((a, b) => b.amount - a.amount);
    }
    // 元の順序に戻す
    return [...mapped].sort((a, b) => a.originalIndex - b.originalIndex);
  }, [bills, groupingType, sortOrder]);

  return { data, sortOrder, setSortOrder };
};

/**
 * 上位20%のインデックスを計算するフック
 * ソートが有効な場合のみ計算を行う
 * @param data - チャート表示用データ
 * @param sortOrder - 現在のソート順序
 */
export const useTop20Indices = (
  data: ChartDataItem[],
  sortOrder: SortOrder,
): Set<number> => {
  return useMemo(() => {
    // ソートが無効な場合は空のSetを返す
    if (sortOrder === 'none') {
      return new Set<number>();
    }

    // 金額で降順ソートしてインデックスを取得
    const sortedByAmount = [...data]
      .map((item, index) => ({ ...item, currentIndex: index }))
      .sort((a, b) => b.amount - a.amount);

    const top20Count = Math.ceil(data.length * TOP_PERCENTAGE);
    const top20Set = new Set<number>();

    // 上位20%のインデックスをSetに追加
    for (let i = 0; i < top20Count; i++) {
      top20Set.add(sortedByAmount[i].currentIndex);
    }

    return top20Set;
  }, [data, sortOrder]);
};
