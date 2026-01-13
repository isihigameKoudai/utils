import type { Symbol, Timeframe } from '../constants';

export interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

export interface TokenSelectorProps {
  selectedToken: Symbol;
  onTokenChange: (token: Symbol) => void;
}
