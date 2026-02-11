import React from 'react';

import { styled } from '@/utils/ui/styled';

import { TIMEFRAMES } from '../constants';
import type { TimeframeSelectorProps } from '../types';

const SelectContainer = styled('div')({
  marginBottom: '20px',
});

const StyledSelect = styled('select')({
  padding: '5px',
  fontSize: '14px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  color: '#333',
});

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onTimeframeChange,
}) => {
  return (
    <SelectContainer>
      <StyledSelect
        value={selectedTimeframe}
        onChange={(e) =>
          onTimeframeChange(e.target.value as (typeof TIMEFRAMES)[number])
        }
      >
        {TIMEFRAMES.map((timeframe) => (
          <option key={timeframe} value={timeframe}>
            {timeframe === '1d' ? '日足' : '月足'}
          </option>
        ))}
      </StyledSelect>
    </SelectContainer>
  );
};
