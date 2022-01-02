import React, { memo } from 'react';
import { css } from '@emotion/css';

import { sum, average, deviation } from '../../packages/math';

type Props = {
  list: number[];
}

const style = css`
  padding: 10px 8px;
  p {
    margin: 0;
  }
`;

const CalendarCell: React.FC<Props> = memo(({ list }) => {
  return (
    <div className={style}>
      <p>合計 {sum(list)}</p>
      <p>平均 { average(list)}</p>
      <p>標準偏差 { deviation(list)}</p>
    </div>
  )
});

export default CalendarCell;
