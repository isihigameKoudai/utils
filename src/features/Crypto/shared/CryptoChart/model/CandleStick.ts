import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

export type Trade = [
  // Open time
  number,
  // Open price
  string,
  // High price
  string,
  // Low price
  string,
  // Close(latest price)
  string,
  // Volume
  string,
  // Close time
  number,
  // base asset volume
  string,
  // Number of trades
  number,
  // Taker buy volume
  string,
  // Taker buy base asset volume
  string,
  // Ignore
  string,
];

export const toCandlestickData = (
  trades: Trade[],
): CandlestickData<UTCTimestamp>[] => {
  return trades.map((trade) => ({
    time: (trade[0] / 1000) as UTCTimestamp,
    open: Number(trade[1]),
    high: Number(trade[2]),
    low: Number(trade[3]),
    close: Number(trade[4]),
  }));
};
