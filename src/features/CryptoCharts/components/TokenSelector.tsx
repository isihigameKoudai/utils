import React from 'react';
import { styled } from '@/utils/ui/styled';
import { SYMBOLS } from '../constants';
import { TokenSelectorProps } from '../types';

const Header = styled('div')({
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
});

const StyledSelect = styled('select')({
  padding: '8px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  color: '#333',
});

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenChange,
}) => {
  return (
    <Header>
      <StyledSelect
        value={selectedToken}
        onChange={(e) => onTokenChange(e.target.value as typeof SYMBOLS[number])}
      >
        {SYMBOLS.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </StyledSelect>
    </Header>
  );
}; 
