import { useEffect, useState } from 'react';

import { CryptoChart } from '../../components/CryptoChart';
import { MULTI_TIMEFRAMES, SYMBOLS, type Symbol } from '../../constants';
import { useTrade } from '../../hooks/useTrade';
import { getTimeframeLabel } from '../../modules/utils';

import {
  ActiveTimeframeButton,
  AddSymbolArea,
  ChartCell,
  ChartGrid,
  ChartHeader,
  ErrorOverlay,
  LoadingOverlay,
  PageContainer,
  PairLabel,
  RemoveButton,
  SymbolLink,
  SymbolSelect,
  TimeframeButton,
  Toolbar,
} from './style';

export const TradePage = () => {
  const { queries, actions } = useTrade();
  const [symbolToAdd, setSymbolToAdd] = useState<Symbol>('DOGE');

  const selectedTimeframe = queries.selectedTimeframe;
  const selectedSymbols = queries.selectedSymbols;

  const availableSymbols = SYMBOLS.filter((s) => !selectedSymbols.includes(s));

  useEffect(() => {
    actions.fetchAllChartData();
  }, []);

  const handleAddSymbol = () => {
    actions.addSymbolAndFetch({ symbol: symbolToAdd });

    const nextAvailable = availableSymbols.filter((s) => s !== symbolToAdd);
    if (nextAvailable.length > 0) {
      setSymbolToAdd(nextAvailable[0]);
    }
  };

  return (
    <PageContainer>
      <Toolbar>
        {MULTI_TIMEFRAMES.map((tf) =>
          tf === selectedTimeframe ? (
            <ActiveTimeframeButton key={tf} type="button">
              {getTimeframeLabel(tf)}
            </ActiveTimeframeButton>
          ) : (
            <TimeframeButton
              key={tf}
              type="button"
              onClick={() => actions.changeTimeframe({ timeframe: tf })}
            >
              {getTimeframeLabel(tf)}
            </TimeframeButton>
          ),
        )}

        {availableSymbols.length > 0 && (
          <AddSymbolArea>
            <SymbolSelect
              value={symbolToAdd}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSymbolToAdd(e.target.value as Symbol)
              }
            >
              {availableSymbols.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SymbolSelect>
            <TimeframeButton type="button" onClick={handleAddSymbol}>
              追加
            </TimeframeButton>
          </AddSymbolArea>
        )}
      </Toolbar>

      <ChartGrid>
        {selectedSymbols.map((symbol) => {
          const chartData = queries.chartDataFor(symbol, selectedTimeframe);
          const isLoading = queries.isLoadingFor(symbol, selectedTimeframe);
          const error = queries.errorFor(symbol, selectedTimeframe);

          return (
            <ChartCell key={symbol}>
              <ChartHeader>
                <div>
                  <SymbolLink to={`/trade/${symbol}`}>{symbol}</SymbolLink>
                  <PairLabel>/USDT</PairLabel>
                </div>
                <RemoveButton
                  type="button"
                  onClick={() => actions.removeSymbol({ symbol })}
                >
                  ✕
                </RemoveButton>
              </ChartHeader>

              {isLoading && <LoadingOverlay>読み込み中...</LoadingOverlay>}
              {error && <ErrorOverlay>{error}</ErrorOverlay>}
              {!isLoading && !error && chartData && (
                <CryptoChart data={chartData} isDark />
              )}
              {!isLoading && !error && !chartData && (
                <LoadingOverlay>データなし</LoadingOverlay>
              )}
            </ChartCell>
          );
        })}
      </ChartGrid>
    </PageContainer>
  );
};
