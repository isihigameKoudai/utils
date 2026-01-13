import type { Timeframe, MultiTimeframe } from '../constants';

export const getTimeframeLabel = (
  timeframe: Timeframe | MultiTimeframe,
): string => {
  switch (timeframe) {
    case '1h':
      return '1時間足';
    case '1d':
      return '日足';
    case '1w':
      return '週足';
    case '1M':
      return '月足';
    default:
      return timeframe;
  }
};
