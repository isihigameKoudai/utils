import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

import { ColorTheme } from '@/packages/PreferColorScheme';
import { styledZero } from '@/packages/ui/styled';

import { CandleStick } from './model/CandleStick';
import { createChartColor, createSeriesColor } from './module';

const FullBox = styledZero('div')({
  width: '100%',
  height: '100%',
});

interface CryptoChartPresenterProps {
  candleData: CandleStick[];
  symbol: string;
  width?: number;
  height?: number;
  colorTheme?: ColorTheme;
}

const CryptoChartPresentational: React.FC<CryptoChartPresenterProps> = ({
  candleData,
  symbol,
  width,
  height,
  colorTheme = 'light',
}) => {
  const fullBoxRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<'Candlestick'> | null>(null);
  
  const chartColor = createChartColor(colorTheme);
  const seriesColor = createSeriesColor();

  useEffect(() => {
    if (!chartRef.current || !fullBoxRef.current) {
      return () => {}; 
    }
    chart.current = createChart(chartRef.current, {
      ...chartColor,
      width: width || fullBoxRef.current.clientWidth,
      height: height || fullBoxRef.current.clientHeight,
    });
    series.current = chart.current.addCandlestickSeries(seriesColor);
    series.current.setData(candleData.map(candle => candle.series));

    return () => {
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, [candleData, symbol]);

  useEffect(() => {
    let initialized = false;

    if(initialized) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const {
          width: currentWidth,
          height: currentHeight
        } = entry.contentRect;

        const resizeWidth = width || currentWidth;
        const resizeHeight = height || currentHeight;

        if(fullBoxRef.current) {
          fullBoxRef.current.style.height = `${resizeHeight}px`;
        }

        if (chart.current) {
          chart.current.resize(resizeWidth, resizeHeight);
        }
      }
    });

    if (fullBoxRef.current) {
      resizeObserver.observe(fullBoxRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [width, height]);

  return <FullBox className='full-box' ref={fullBoxRef}>
    <div className={`crypto-chart-${symbol}`} ref={chartRef} />
  </FullBox>;
};

CryptoChartPresentational.displayName = 'CryptoChartPresentational';

export default CryptoChartPresentational;
