import { Symbol, Timeframe, MultiTimeframe } from '../constants';

export interface ChartData {
  symbol: Symbol;
  timeframe: Timeframe | MultiTimeframe;
  data: any[];
}

export interface ChartConfig {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
}

export interface CryptoChartProps {
  symbol: Symbol;
  timeframe: Timeframe | MultiTimeframe;
  width?: number;
  height?: number;
}

export interface ChartBoxProps {
  symbol: Symbol;
  timeframe: Timeframe | MultiTimeframe;
}

export interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

export interface TokenSelectorProps {
  selectedToken: Symbol;
  onTokenChange: (token: Symbol) => void;
}
