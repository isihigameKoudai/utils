import React, { memo } from 'react';
import { css } from '@emotion/css';

import { DailySales } from '../model/DailySales';
import { divideDate } from '../../packages/date'

type Props = {
  dailySales: DailySales
  selectedDaily?: keyof DailySales
}

const style = css`
  p {
    margin: 0;
  }

  .date {
    font-size: 20px;
  }
`;

const TableCell: React.FC<Props> = memo(({ dailySales, selectedDaily = 'sales' }) => {
  const { month, day } = divideDate(dailySales.aggregationPeriod)
  return (
    <div className={style}>
      <p className='date'>{ month }/{ day }</p>
      <span>{ dailySales[selectedDaily] }</span>
    </div>
  )
})

export default TableCell;
