import { UTCTimestamp } from 'lightweight-charts';

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

export class CandleStick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;

  constructor(params: Trade) {
    this.time = params[0];

    this.open = parseFloat(params[1]);
    this.high = parseFloat(params[2]);
    this.low = parseFloat(params[3]);
    this.close = parseFloat(params[4]);
    this.volume = parseFloat(params[5]);

    this.closeTime = params[6];
    this.quoteAssetVolume = params[7];
    this.numberOfTrades = params[8];
    this.takerBuyBaseAssetVolume = params[9];
    this.takerBuyQuoteAssetVolume = params[10];
    this.ignore = params[11];
  }

  get series() {
    return {
      time: (this.time / 1000) as UTCTimestamp,
      open: this.open,
      high: this.high,
      low: this.low,
      close: this.close,
    };
  }
}
