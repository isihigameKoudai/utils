import api from '../api';
import { apiMap } from './config';

interface GetKLines {
  // 対応銘柄
  // https://api.coin.z.com/docs/#t-spot_param_list_symbol
  token: string;
  // なぜか4hour以降エラーになる
  interval: '1min' | '5min' | '10min' | '15min' | '30min' | '1hour' | '4hour' | '8hour' | '12hour' | '1day' | '1week' | '1month';
  yyyymmdd?: string;
}

interface GetKLinesResponse {
  status: number;
  responsetime: string; // 2021-08-31T22:24:56.889Z（ISO 8601形式）
  data: {
    openTime: string;  // 1618693140000 Unixタイムスタンプ（ミリ秒単位）形式
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }[]
}

/**
 * 
 * https://api.coin.z.com/docs/#klines
 */
export const fetchKLines = ({ token, interval, yyyymmdd = '20210415'}: GetKLines) => {
  return api.get<GetKLinesResponse>(`${apiMap.gmo.url}/public/v1/klines?symbol=${token}&interval=${interval}&date=${yyyymmdd}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
