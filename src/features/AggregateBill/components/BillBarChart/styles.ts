/**
 * BillBarChart/styles.ts
 * 棒グラフコンポーネントのスタイル定義
 */

import { styled } from '@/src/shared/styled';

/** チャート全体のラッパー */
export const ChartWrapper = styled('div')({
  marginBottom: '2rem',
});

/** ソートコントロールのコンテナ */
export const SortControls = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '0.5rem',
  gap: '0.5rem',
});

/** ソートボタン */
export const SortButton = styled('button')({
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

/** チャートのコンテナ（サイズ指定） */
export const ChartContainer = styled('div')({
  height: 400,
  width: '100%',
});

/** 凡例のラッパー */
export const Legend = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '1.5rem',
  marginTop: '0.5rem',
  fontSize: '0.875rem',
});

/** 凡例アイテム */
export const LegendItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});
