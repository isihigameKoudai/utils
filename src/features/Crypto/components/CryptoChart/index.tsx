import {
  createChart,
  CandlestickSeries,
  type CandlestickData,
  type IChartApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

import {
  CHART_DARK_COLOR,
  CHART_LIGHT_COLOR,
  SERIES_COLOR,
} from '../../shared/CryptoChart/constants';

interface CryptoChartProps {
  data: CandlestickData<UTCTimestamp>[];
  isDark?: boolean;
  width?: number;
  height?: number;
}

export const CryptoChart = ({
  data,
  isDark = false,
  width,
  height = 300,
}: CryptoChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const colors = isDark ? CHART_DARK_COLOR : CHART_LIGHT_COLOR;

    const chart = createChart(containerRef.current, {
      autoSize: !width,
      width,
      height,
      layout: {
        background: { color: colors.BACKGROUND },
        textColor: colors.TEXT,
      },
      grid: {
        vertLines: { color: colors.GRID_LINE },
        horzLines: { color: colors.GRID_LINE },
      },
      timeScale: {
        borderColor: colors.GRID_LINE,
      },
      rightPriceScale: {
        borderColor: colors.GRID_LINE,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: SERIES_COLOR.UP,
      downColor: SERIES_COLOR.DOWN,
      borderUpColor: SERIES_COLOR.UP,
      borderDownColor: SERIES_COLOR.DOWN,
      wickUpColor: SERIES_COLOR.WICK_UP,
      wickDownColor: SERIES_COLOR.WICK_DOWN,
    });

    series.setData(data);
    chart.timeScale().fitContent();

    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [data, isDark, width, height]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
};
