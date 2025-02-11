import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { styled } from '@/packages/ui/styled';

import { CryptoChart, CryptoStore } from '@/src/components/CryptoChart';
import { CryptoTheme } from '../theme';
import { SYMBOLS } from '../constants';

const DEFAULT_TOKEN = 'BTC';
const timeframes = ['1h', '1d', '1w', '1M'] as const;

interface Props {
  token: string;
}

const MultiChartPage: React.FC<Props> = ({ token }) => {
  const navigate = useNavigate();

  const handleChangeToken = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/crypto-charts/multi/${e.target.value}`);
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

const getTimeframeLabel = (timeframe: string) => {
  switch (timeframe) {
    case '1h': return '1時間足';
    case '1d': return '日足';
    case '1w': return '週足';
    case '1M': return '月足';
    default: return timeframe;
  }
};
const StyledContainer = styled('div')((theme) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#222',
  padding: theme.spacing(2),
  minHeight: '100vh',
}));

const Header = styled('div')(() => ({
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
}));

const ChartGrid = styled('div')(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '20px',
  '@media (max-width: 1200px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
}));

const ChartContainer = styled('div')(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '8px',
  padding: '16px',
  height: '360px',
}));

const ChartTitle = styled('h3')((theme) => ({
  margin: '0 0 16px 0',
  textAlign: 'center',
  color: theme.palette.mode === 'light' ? '#333' : '#ddd',
}));

export default () => {
  const params = useParams<{ token?: string }>();
  const { token } = params;
  const validToken = (SYMBOLS).some( symbolItem => symbolItem === token) ? token : DEFAULT_TOKEN;

  if (!SYMBOLS.some( symbolItem => symbolItem === token) || !validToken) {
    return <Navigate to={`/crypto-charts/multi/${DEFAULT_TOKEN}`} replace />;
  }

  return (
    <CryptoTheme.Provider>
      <CryptoStore.Provider>
        <MultiChartPage token={validToken} />
      </CryptoStore.Provider>
    </CryptoTheme.Provider>
  )
};
