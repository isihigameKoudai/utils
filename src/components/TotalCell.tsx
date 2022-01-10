import React, { memo } from 'react';
import { css } from '@emotion/css';

import { sum, average, deviation } from '../../packages/math';

type Props = {
  list: number[];
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

const CalendarCell: React.FC<Props> = memo(({ list }) => {
  return (
    <div className={style}>
      <p>合計 <br /><span className='amount-label'>{ Math.round(sum(list)).toLocaleString() }</span>円</p>
      <p>平均 <br /><span className='amount-label'>{ Math.round(average(list)).toLocaleString() }</span>円</p>
      <p>標準偏差 { Math.round(deviation(list)).toLocaleString()}</p>
    </div>
  )
});

export default CalendarCell;
