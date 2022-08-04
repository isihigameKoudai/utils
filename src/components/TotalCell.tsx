import React, { memo } from 'react';
import { css } from '@emotion/css';

import { sum, average, deviation } from '../../packages/math';
import { DailySales, dailyKey, unitObj } from '../model/DailySales';

type Props = {
  list: number[];
  selectedDaily: keyof typeof unitObj
}

const style = css`
  p {
    margin: 0;
  }
  
  .amount-label {
    font-weight: bold;
    font-size: 18px;
  }
`;

const CalendarCell: React.FC<Props> = memo(({ list, selectedDaily }) => {
  console.log(selectedDaily, unitObj[selectedDaily]);
  return (
    <div className={style}>
      <p>合計 <br /><span className='amount-label'>{ Math.round(sum(list)).toLocaleString() }</span>{ unitObj[selectedDaily] }</p>
      <p>平均 <br /><span className='amount-label'>{ Math.round(average(list)).toLocaleString() }</span>{ unitObj[selectedDaily] }</p>
      <p>標準偏差 { Math.round(deviation(list)).toLocaleString()} { unitObj[selectedDaily] }</p>
    </div>
  )
});

export default CalendarCell;
