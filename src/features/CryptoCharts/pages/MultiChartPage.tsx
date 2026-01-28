import { useNavigate, useParams } from '@tanstack/react-router';
import React from 'react';

import { styled } from '@/utils/styled';

import { MultiChartGrid } from '../components/MultiChartGrid';
import { TokenSelector } from '../components/TokenSelector';
import type { Symbol } from '../constants';

const StyledContainer = styled('div')({
  backgroundColor: '#222',
  padding: 16,
  minHeight: '100vh',
});

const MultiChartPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams({ from: '/crypto-charts/multi/$token' });

  return (
    <StyledContainer>
      <TokenSelector
        selectedToken={token as Symbol}
        onTokenChange={(newToken) => {
          navigate({
            to: '/crypto-charts/multi/$token',
            params: { token: newToken },
          });
        }}
      />
      <MultiChartGrid token={token as Symbol} />
    </StyledContainer>
  );
};

export default MultiChartPage;
