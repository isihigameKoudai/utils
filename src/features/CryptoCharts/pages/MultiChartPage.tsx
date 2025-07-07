import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { styled } from '@/utils/ui/styled';
import { TokenSelector } from '../components/TokenSelector';
import { MultiChartGrid } from '../components/MultiChartGrid';
import { SYMBOLS, Symbol, DEFAULT_TOKEN } from '../constants';

const StyledContainer = styled('div')({
  backgroundColor: '#222',
  padding: 16,
  minHeight: '100vh',
});

const MultiChartPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams({ from: '/crypto-charts/multi/$token' });

  const handleChangeToken = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({ 
      to: '/crypto-charts/multi/$token', 
      params: { token: e.target.value as Symbol } 
    });
  };

  return (
    <StyledContainer>
      <TokenSelector
        selectedToken={token as Symbol}
        onTokenChange={(newToken) => {
          navigate({ 
            to: '/crypto-charts/multi/$token', 
            params: { token: newToken } 
          });
        }}
      />
      <MultiChartGrid token={token as Symbol} />
    </StyledContainer>
  );
};

export default MultiChartPage; 
