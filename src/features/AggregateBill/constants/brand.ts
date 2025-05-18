export const BRAND = {
  rakuten: {
    value: 'rakuten',
    label: '楽天カード',
    columns: [
      '利用日',
      '利用店名・商品名',
      '支払総額',
    ]
  },
  view: {
    value: 'view',
    label: 'ビックカメラsuica',
    columns: [
      'ご利用年月日',
      'ご利用箇所',
      '今回ご請求額・弁済金（うち手数料・利息）',
    ]
  },
  docomo: {
    value: 'docomo',
    label: 'ドコモ（dカード）',
    columns: [
      'ご利用年月日',
      '利用店名',
      '支払い金額',
    ]
  },
  bitFlyer: {
    value: 'bitFlyer',
    label: 'bitFlyer（アプラス）',
    columns: [
      'ご利用日',
      'ご利用店名',
      'お支払金額',
    ]
  },
  yodobashi: {
    value: 'yodobashi',
    label: 'ヨドバシ',
    columns: [
      '利用日',
      '項目',
      '金額',
    ]
  }
} as const;

