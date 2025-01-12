import api from '../../../../packages/api';
import { Trade } from '../model/CandleStick';

export interface CryptoListParams {
  symbol: string;
  interval: '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M';
}

type CryptoList = Trade[];

export const fetchTradeDataList = async ({ symbol, interval }: CryptoListParams): Promise<CryptoList> => {
  const response = await api.get<CryptoList>(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}`);
  return response;
};