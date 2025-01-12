import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

import { CandleStick } from './model/CandleStick';
import { createChartColor, createSeriesColor } from './module';

interface CryptoChartPresenterProps {
  candleData: CandleStick[];
  symbol: string;
  width?: number;
  height?: number;
}

const CryptoChartPresentational: React.FC<CryptoChartPresenterProps> = ({
  candleData,
  symbol,
  width = 600,
  height = 400,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const chartColor = createChartColor('light');
  const seriesColor = createSeriesColor();

  useEffect(() => {
    if (!chartContainerRef.current) {
      return () => {}; 
    }

    chart.current = createChart(chartContainerRef.current, {
      ...chartColor,
      width,
      height,
    });
    series.current = chart.current.addCandlestickSeries(seriesColor);
    series.current.setData(candleData.map(candle => candle.series));

    return () => {
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, [candleData, symbol]);

  return <div className={`crypto-chart-${symbol}`} ref={chartContainerRef} />;
};

CryptoChartPresentational.displayName = 'CryptoChartPresentational';

export default CryptoChartPresentational;
