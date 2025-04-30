import React from 'react';
import { Navigate, useNavigate, useParams } from '@tanstack/react-router';
import { styled } from '@/utils/ui/styled';
import { multiChartRoute } from '@/src/routes/crypto-charts/multi';

import { CryptoChart } from '@/src/components/CryptoChart';
import { CryptoTheme } from '../theme';
import { SYMBOLS } from '../constants';

const DEFAULT_TOKEN = 'BTC';
const timeframes = ['1h', '1d', '1w', '1M'] as const;

const getTimeframeLabel = (timeframe: string) => {
  switch (timeframe) {
    case '1h': return '1時間足';
    case '1d': return '日足';
    case '1w': return '週足';
    case '1M': return '月足';
    default: return timeframe;
  }
};

const StyledContainer = styled('div')({
  backgroundColor: '#222',
  padding: 16,
  minHeight: '100vh',
});

const Header = styled('div')({
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
});

const ChartGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
});

const ChartContainer = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
  padding: '16px',
  height: '360px',
});

const ChartTitle = styled('h3')({
  margin: '0 0 16px 0',
  textAlign: 'center',
  color: '#ccc',
});

interface Props {
  token: string;
}

const MultiChartPage: React.FC<Props> = ({ token }) => {
  const navigate = useNavigate();

  const handleChangeToken = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({ to: `/crypto-charts/multi/${e.target.value}` });
  }

  return (
    <StyledContainer>
      <Header>
        <select
          value={token}
          onChange={handleChangeToken}
          style={{ padding: '8px', fontSize: '16px' }}
        >
          {SYMBOLS.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </Header>
      <ChartGrid>
        {timeframes.map((timeframe) => (
          <ChartContainer key={timeframe}>
            <ChartTitle>{getTimeframeLabel(timeframe)}</ChartTitle>
            <CryptoChart 
              key={`${token}-${timeframe}`} 
              symbol={token} 
              timeframe={timeframe} 
              height={300}
            />
          </ChartContainer>
        ))}
      </ChartGrid>
    </StyledContainer>
  );
};

export default () => {
  const params = useParams({ from: multiChartRoute.id });
  const { token } = params;
  const validToken = (SYMBOLS).some( symbolItem => symbolItem === token) ? token : DEFAULT_TOKEN;

  if (!SYMBOLS.some( symbolItem => symbolItem === token) || !validToken) {
    return <Navigate from={multiChartRoute.id} to={multiChartRoute.id} params={{ token: DEFAULT_TOKEN }} replace />;
  }

  return (
    <CryptoTheme.Provider>
      <MultiChartPage token={validToken} />
    </CryptoTheme.Provider>
  )
};
