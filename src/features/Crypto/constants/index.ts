export const SYMBOLS = [
  'BTC',
  'ETH',
  'BNB',
  'XRP',
  'ADA',
  'DOGE',
  'SOL',
  'DOT',
  'MATIC',
  'LINK',
  'UNI',
  'ATOM',
  'AVAX',
  'LTC',
  'ETC',
  'FIL',
  'NEAR',
  'ALGO',
  'APE',
  'AXS',
  'SAND',
  'MANA',
  'AAVE',
  'EGLD',
  'EOS',
  'FLOW',
  'GALA',
  'GRT',
  'HBAR',
  'ICP',
  'IOTA',
  'NEO',
  'ONE',
  'THETA',
  'VET',
  'XLM',
  'XTZ',
  'ZEC',
] as const;

export type Symbol = (typeof SYMBOLS)[number];

export const TIMEFRAME = {
  HOUR: {
    value: '1h',
    label: '1時間足',
  },
  DAY: {
    value: '1d',
    label: '日足',
  },
  WEEK: {
    value: '1w',
    label: '週足',
  },
  MONTH: {
    value: '1M',
    label: '月足',
  },
} as const;

export const MULTI_TIMEFRAMES = Object.values(TIMEFRAME).map((v) => v.value);
export type MultiTimeframe = (typeof MULTI_TIMEFRAMES)[number];
