import { useNavigate, useParams } from '@tanstack/react-router';
import React from 'react';

import { SYMBOLS, DEFAULT_TOKEN } from '../constants';
import { CryptoTheme } from '../modules/theme';

import MultiChartPage from './MultiChartPage';

const MultiChart: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams({ from: '/crypto-charts/multi/$token' });

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
