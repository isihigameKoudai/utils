import * as React from 'react';
import { css } from '@emotion/css';
import { sum } from '../../../packages/math';
import { color } from './constants';

type Props = {
  totalPerHour: number;
  totalDailySales: number[];
}

const style = css`
  position: relative;
  width: ${color.COL_WIDTH}px;
  min-width: ${color.COL_WIDTH}px;
  background: inherit;
  border-right: solid 1px ${color.LIGHT_GRAY};
  border-bottom:  solid 1px ${color.LIGHT_GRAY};
  height: ${color.HEADER_ROW_HEIGHT}px;
  box-sizing: border-box;
  text-align: center;
  padding: 10px 0;

  .title {
    font-weight: bold;
  }
`;

const TotalCell: React.FC<Props> = ({ totalPerHour, totalDailySales }) => {
  const totalLabel = !!totalPerHour ? `${totalPerHour.toLocaleString()}円` : ''
  const percentage = ((totalPerHour / sum(totalDailySales)) * 100).toFixed(2);
  return (
    <div className={style}>
      <p className='title'>{ totalLabel }</p>
      <p>{ !!totalPerHour && `（${percentage}%）`}</p>
    </div>
  )
}

export default TotalCell;
