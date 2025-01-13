import { DeepPartial, ChartOptions, ColorType, CandlestickSeriesPartialOptions } from 'lightweight-charts';

import { ColorTheme } from '@/packages/PreferColorScheme';

import { CHART_DARK_COLOR, CHART_LIGHT_COLOR, SERIES_COLOR } from './constants';


export const createChartColor = (theme: ColorTheme): DeepPartial<ChartOptions> => {
  const colors = theme === 'light' ? CHART_LIGHT_COLOR : CHART_DARK_COLOR;

  return {
    layout: {
      background: { 
        type: ColorType.Solid, 
        color: colors.BACKGROUND 
      },
      textColor: colors.TEXT,
    },
    grid: {
      vertLines: { color: colors.GRID_LINE },
      horzLines: { color: colors.GRID_LINE },
    }
  };
};

export const createSeriesColor = (): CandlestickSeriesPartialOptions => {
  return {
    borderVisible: false,
    upColor: SERIES_COLOR.UP,
    downColor: SERIES_COLOR.DOWN,
    wickUpColor: SERIES_COLOR.UP,
    wickDownColor: SERIES_COLOR.DOWN,
  }
};
