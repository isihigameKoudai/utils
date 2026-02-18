import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

import type { ActionsProps } from '@/utils/i-state';

import { fetchTradeDataList } from '../../api/crypto';
import type { MultiTimeframe, Symbol } from '../../constants';
import type { Trade } from '../../shared/CryptoChart/model/CandleStick';

import { queries, toChartDataKey } from './queries';
import type { LoadingState, TradeState } from './type';

const toCandlestickData = (
  trades: Trade[],
): CandlestickData<UTCTimestamp>[] => {
  return trades.map((trade) => ({
    time: (trade[0] / 1000) as UTCTimestamp,
    open: Number(trade[1]),
    high: Number(trade[2]),
    low: Number(trade[3]),
    close: Number(trade[4]),
  }));
};

export const actions = {
  async fetchAllChartData({ state, dispatch }) {
    const { selectedSymbols, selectedTimeframe } = state;

    const loadingUpdate = selectedSymbols.reduce<LoadingState>(
      (acc, symbol) => {
        acc[toChartDataKey(symbol, selectedTimeframe)] = true;
        return acc;
      },
      { ...state.loading },
    );
    dispatch('loading', loadingUpdate);

    const results = await Promise.allSettled(
      selectedSymbols.map(async (symbol) => {
        const trades = await fetchTradeDataList({
          symbol,
          interval: selectedTimeframe,
        });
        return { symbol, data: toCandlestickData(trades) };
      }),
    );

    const chartDataUpdate = { ...state.chartData };
    const errorsUpdate = { ...state.errors };
    const loadingDone = { ...loadingUpdate };

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const symbol = selectedSymbols[i];
      const key = toChartDataKey(symbol, selectedTimeframe);
      loadingDone[key] = false;

      if (result.status === 'fulfilled') {
        chartDataUpdate[key] = result.value.data;
        errorsUpdate[key] = undefined;
      } else {
        const err = result.reason;
        errorsUpdate[key] =
          err instanceof Error ? err.message : 'データ取得に失敗しました';
      }
    }

    dispatch('chartData', chartDataUpdate);
    dispatch('errors', errorsUpdate);
    dispatch('loading', loadingDone);
  },

  async changeTimeframe(
    { state, dispatch },
    { timeframe }: { timeframe: MultiTimeframe },
  ) {
    dispatch('selectedTimeframe', timeframe);

    const { selectedSymbols } = state;

    const loadingUpdate = selectedSymbols.reduce<LoadingState>(
      (acc, symbol) => {
        acc[toChartDataKey(symbol, timeframe)] = true;
        return acc;
      },
      { ...state.loading },
    );
    dispatch('loading', loadingUpdate);

    const results = await Promise.allSettled(
      selectedSymbols.map(async (symbol) => {
        const trades = await fetchTradeDataList({
          symbol,
          interval: timeframe,
        });
        return { symbol, data: toCandlestickData(trades) };
      }),
    );

    const chartDataUpdate = { ...state.chartData };
    const errorsUpdate = { ...state.errors };
    const loadingDone = { ...loadingUpdate };

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const symbol = selectedSymbols[i];
      const key = toChartDataKey(symbol, timeframe);
      loadingDone[key] = false;

      if (result.status === 'fulfilled') {
        chartDataUpdate[key] = result.value.data;
        errorsUpdate[key] = undefined;
      } else {
        const err = result.reason;
        errorsUpdate[key] =
          err instanceof Error ? err.message : 'データ取得に失敗しました';
      }
    }

    dispatch('chartData', chartDataUpdate);
    dispatch('errors', errorsUpdate);
    dispatch('loading', loadingDone);
  },

  async addSymbolAndFetch({ state, dispatch }, { symbol }: { symbol: Symbol }) {
    if (state.selectedSymbols.includes(symbol)) return;

    dispatch('selectedSymbols', [...state.selectedSymbols, symbol]);

    const timeframe = state.selectedTimeframe;
    const key = toChartDataKey(symbol, timeframe);

    dispatch('loading', { ...state.loading, [key]: true });
    dispatch('errors', { ...state.errors, [key]: undefined });

    try {
      const trades = await fetchTradeDataList({ symbol, interval: timeframe });
      const candlestickData = toCandlestickData(trades);

      dispatch('chartData', { ...state.chartData, [key]: candlestickData });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'データ取得に失敗しました';
      dispatch('errors', { ...state.errors, [key]: message });
    } finally {
      dispatch('loading', { ...state.loading, [key]: false });
    }
  },

  removeSymbol({ state, dispatch }, { symbol }: { symbol: Symbol }) {
    dispatch(
      'selectedSymbols',
      state.selectedSymbols.filter((s) => s !== symbol),
    );
  },
} satisfies ActionsProps<TradeState, typeof queries>;
