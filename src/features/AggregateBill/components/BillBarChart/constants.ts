/**
 * BillBarChart/constants.ts
 * 棒グラフコンポーネントで使用する定数
 */

/** 上位20%の色（強調色） */
export const TOP_20_COLOR = '#ff7300';

/** 下位80%の色（通常色） */
export const BOTTOM_80_COLOR = '#8884d8';

/** 上位20%を計算する際の割合 */
export const TOP_PERCENTAGE = 0.2;

/** チャートのマージン設定 */
export const CHART_MARGIN = {
  top: 5,
  right: 30,
  left: 20,
  bottom: 5,
} as const;

/** 凡例の色表示スタイル */
export const LEGEND_COLOR_STYLE = {
  display: 'inline-block',
  width: '16px',
  height: '16px',
  borderRadius: '2px',
} as const;

/** ソート順序のラベルマッピング */
export const SORT_ORDER_LABELS = {
  none: '元の順序',
  asc: '金額: 昇順 ↑',
  desc: '金額: 降順 ↓',
} as const;

/** ソート順序の選択肢 */
export const SORT_ORDER_OPTIONS = ['none', 'asc', 'desc'] as const;
