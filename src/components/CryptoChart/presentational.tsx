import React, { useEffect, useRef } from 'react';
import { createChart, type IChartApi } from 'lightweight-charts';

import { type ColorTheme } from '@/utils/PreferColorScheme';
import { styled } from '@/utils/ui/styled';

import { type CandleStick } from './model/CandleStick';
import { createChartColor } from './module';

const FullBox = styled('div')({
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

  const chartColor = createChartColor(colorTheme);

  useEffect(() => {
    if (!chartRef.current || !fullBoxRef.current || !chart.current) {
      return () => {};
    }
    chart.current = createChart(chartRef.current, {
      ...chartColor,
      width: width || fullBoxRef.current.clientWidth,
      height: height || fullBoxRef.current.clientHeight,
    });
    // TODO: エラーになるので後で直す
    // const seriesColor = createSeriesColor();
    // const series = chart.current.addCandlestickSeries(seriesColor);
    // series.setData(candleData.map(candle => candle.series));

    // const handleChange: DataChangedHandler = (e) => {
    //   series?.setData(candleData.map(candle => candle.series));
    //   console.log('subscribeDataChanged', e);
    // };

    // series.subscribeDataChanged(handleChange);

    return () => {
      // series?.unsubscribeDataChanged(handleChange);
      chart.current?.remove();
    };
  }, [candleData, symbol, chartColor, width, height]);

  useEffect(() => {
    const initialized = false;

    if (initialized) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: currentWidth, height: currentHeight } =
          entry.contentRect;

        const resizeWidth = width || currentWidth;
        const resizeHeight = height || currentHeight;

        if (fullBoxRef.current) {
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

  return (
    <FullBox className="full-box" ref={fullBoxRef}>
      <div className={`crypto-chart-${symbol}`} ref={chartRef} />
    </FullBox>
  );
};

CryptoChartPresentational.displayName = 'CryptoChartPresentational';

export default CryptoChartPresentational;
