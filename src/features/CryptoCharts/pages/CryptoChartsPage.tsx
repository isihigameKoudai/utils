import React, { useState } from 'react';

import { styled } from '@/utils/ui/styled';

import { ChartGrid } from '../components/ChartGrid';
import { TimeframeSelector } from '../components/TimeframeSelector';
import type { Timeframe } from '../constants';

const StyledContainer = styled('div')({
  backgroundColor: '#222',
  padding: 16,
});

const CryptoChartsPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1d');

  return (
    <StyledContainer>
      <TimeframeSelector
        selectedTimeframe={selectedTimeframe}
        onTimeframeChange={setSelectedTimeframe}
      />
      <ChartGrid timeframe={selectedTimeframe} />
    </StyledContainer>
  );
};

export default CryptoChartsPage;
