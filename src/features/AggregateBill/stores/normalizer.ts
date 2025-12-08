// src/features/AggregateBill/stores/normalizer.ts
// ブランド別のCSV行を集計用フォーマットへ正規化する。
// JCBの金額表示（通貨記号・カンマ）を数値文字列へ変換し、日付・店舗も共通形式へ揃える。

import type { BillProps } from '../models/Bill';
import type { Brand } from '../types/brand';

/**
 * 金額を表す文字列を数値文字列に正規化する
 * 全角マイナスやカンマ、通貨記号を除去し、純粋な数値文字列（負号含む）を返す
 *
 * @param raw - 正規化前の金額文字列 (例: "¥1,000", "-1,200", "−500")
 * @returns 正規化された数値文字列 (例: "1000", "-1200", "-500")
 */
const sanitizeAmount = (raw: string): string => {
  const normalized = raw.trim().replace(/−/g, '-');
  const digitsOnly = normalized.replace(/[^0-9-]/g, '');

  if (digitsOnly === '' || digitsOnly === '-') {
    return '0';
  }

  const isNegative = digitsOnly.startsWith('-');
  const numericPart = digitsOnly.replace(/-/g, '');

  if (numericPart === '') {
    return '0';
  }

  const sanitizedNumeric = numericPart.replace(/^0+(?=\d)/, '') || '0';
  return isNegative ? `-${sanitizedNumeric}` : sanitizedNumeric;
};

/**
 * 共通の正規化処理
 * 日付、店舗名はトリムし、金額はsanitizeAmountで正規化する
 *
 * @param row - [date, store, amount] の形式の配列
 * @returns 正規化された BillProps
 */
const normalizeCommon = ([date, store, amount]: string[]): BillProps => [
  date.trim(),
  store.trim(),
  sanitizeAmount(amount),
];

type Normalizer = (row: string[]) => BillProps;

const brandNormalizers: Partial<Record<Brand, Normalizer>> = {
  jcb_gold: normalizeCommon,
};

/**
 * ブランドごとの行データを正規化する
 * 指定されたブランドに対応する正規化関数があればそれを使用し、なければ共通の正規化処理を行う
 *
 * @param brand - カードブランド (例: 'jcb')
 * @param row - CSVの1行分のデータ配列
 * @returns 正規化された BillProps
 */
export const normalizeBrandRow = (brand: Brand, row: string[]): BillProps => {
  const normalizer = brandNormalizers[brand] ?? normalizeCommon;
  return normalizer(row);
};

/**
 * 複数の行データを一括で正規化する
 *
 * @param brand - カードブランド
 * @param rows - CSVの行データの配列
 * @returns 正規化された BillProps の配列
 */
export const normalizeBrandRows = (
  brand: Brand,
  rows: string[][],
): BillProps[] => rows.map((row) => normalizeBrandRow(brand, row));
