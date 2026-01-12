import React from 'react';

import { CryptoTheme } from '../modules/theme';

import CryptoChartsPage from './CryptoChartsPage';

const CryptoCharts: React.FC = () => {
  return (
    <CryptoTheme.Provider>
      <CryptoChartsPage />
    </CryptoTheme.Provider>
  );
};

export default CryptoCharts;
