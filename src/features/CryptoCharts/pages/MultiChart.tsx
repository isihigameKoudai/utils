import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { CryptoTheme } from '../modules/theme';
import MultiChartPage from './MultiChartPage';
import { SYMBOLS, DEFAULT_TOKEN } from '../constants';

const MultiChart: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams({ from: '/crypto-charts/multi/$token' });
  const validToken = SYMBOLS.includes(token as (typeof SYMBOLS)[number])
    ? token
    : DEFAULT_TOKEN;

  if (!SYMBOLS.includes(token as (typeof SYMBOLS)[number])) {
    navigate({
      to: '/crypto-charts/multi/$token',
      params: { token: DEFAULT_TOKEN },
    });
    return null;
  }

  return (
    <CryptoTheme.Provider>
      <MultiChartPage />
    </CryptoTheme.Provider>
  );
};

export default MultiChart;
