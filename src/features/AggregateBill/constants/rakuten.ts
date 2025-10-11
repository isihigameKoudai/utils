/**
 * 楽天カードの明細データのカラム定義
 *
 * 利用日
 * 利用店名・商品名
 * 利用者
 * 支払方法
 * 利用金額
 * 支払手数料
 * 支払総額
 * 新規サイン
 */

export const RAKUTEN_RECORD = {
  DATE: {
    label: '利用日',
    value: 'date',
  },
  STORE_NAME: {
    label: '利用店名・商品名',
    value: 'storeName',
  },
  USER: {
    label: '利用者',
    value: 'user',
  },
  PAYMENT_METHOD: {
    label: '支払方法',
    value: 'paymentMethod',
  },
  AMOUNT: {
    label: '利用金額',
    value: 'amount',
  },
  FEE: {
    label: '支払手数料',
    value: 'fee',
  },
  TOTAL_AMOUNT: {
    label: '支払総額',
    value: 'totalAmount',
  },
  NEW_SIGN: {
    label: '新規サイン',
    value: 'newSign',
  },
} as const;
