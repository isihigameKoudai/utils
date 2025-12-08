// src/features/AggregateBill/stores/normalizer.test.ts
// ブランド別正規化ロジックの単体テスト。
// JCB金額表記の揺れが数値文字列へ変換されることを確認する。

import { describe, expect, it } from 'vitest';
import { normalizeBrandRow, normalizeBrandRows } from './normalizer';

describe('normalizeBrandRow', () => {
  it('JCBの金額表記から通貨記号とカンマを取り除く', () => {
    const result = normalizeBrandRow('jcb', [
      '2025/01/15',
      'テストショップ',
      '¥12,345',
    ]);
    expect(result).toEqual(['2025/01/15', 'テストショップ', '12345']);
  });

  it('JCBの金額表記に負数や全角マイナスが含まれても正しく変換する', () => {
    const result = normalizeBrandRow('jcb', [
      '2025/02/01',
      'リボ払い調整',
      '−¥1,234円',
    ]);
    expect(result).toEqual(['2025/02/01', 'リボ払い調整', '-1234']);
  });

  it('共通処理で日付と店舗名の前後空白を削除する', () => {
    const result = normalizeBrandRow('rakuten', [
      ' 2025-03-10 ',
      ' サンプル店舗 ',
      '10,000',
    ]);
    expect(result).toEqual(['2025-03-10', 'サンプル店舗', '10000']);
  });
});

describe('normalizeBrandRows', () => {
  it('複数行をブランド別に正規化する', () => {
    const rows = normalizeBrandRows('jcb', [
      ['2025/04/01', 'A店', '¥1,000'],
      ['2025/04/02', 'B店', '¥2,000'],
    ]);

    expect(rows).toEqual([
      ['2025/04/01', 'A店', '1000'],
      ['2025/04/02', 'B店', '2000'],
    ]);
  });
});
