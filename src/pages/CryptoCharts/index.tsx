import React, { useState } from 'react';
import { CryptoChart } from '../../components/CryptoChart';

const timeframes = ['1d', '1M'] as const;
const symbols = ['BTC', 'ETH', 'BNB'] as const;

const CryptoCharts = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '1M'>('1d');
  const [selectedSymbol, setSelectedSymbol] = useState<string>(symbols[1]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        >
          {symbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>

        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as '1d' | '1M')}
          style={{ padding: '5px' }}
        >
          {timeframes.map((timeframe) => (
            <option key={timeframe} value={timeframe}>
              {timeframe === '1d' ? '日足' : '月足'}
            </option>
          ))}
        </select>
      </div>

      <CryptoChart
        symbol={selectedSymbol}
        timeframe={selectedTimeframe}
        width={800}
        height={500}
      />
    </div>
  );
};

export default CryptoCharts;
