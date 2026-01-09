import {
  type DeepPartial,
  type ChartOptions,
  ColorType,
} from 'lightweight-charts';

import type { ColorTheme } from '@/utils/PreferColorScheme';

import { CHART_DARK_COLOR, CHART_LIGHT_COLOR } from './constants';

export const createChartColor = (
  theme: ColorTheme,
): DeepPartial<ChartOptions> => {
  const colors = theme === 'light' ? CHART_LIGHT_COLOR : CHART_DARK_COLOR;

  return {
    layout: {
      background: {
        type: ColorType.Solid,
        color: colors.BACKGROUND,
      },
      textColor: colors.TEXT,
    },
    grid: {
      vertLines: { color: colors.GRID_LINE },
      horzLines: { color: colors.GRID_LINE },
    },
  };
};
