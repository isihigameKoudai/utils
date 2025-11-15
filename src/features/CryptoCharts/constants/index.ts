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

export const TIMEFRAMES = ['1d', '1M'] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const MULTI_TIMEFRAMES = ['1h', '1d', '1w', '1M'] as const;
export type MultiTimeframe = (typeof MULTI_TIMEFRAMES)[number];

export const DEFAULT_TOKEN = 'BTC' as const;
