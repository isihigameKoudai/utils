import * as React from 'react';
import { memo } from 'react';
import { css } from '@emotion/css';
import { Tooltip } from '@mui/material';

import { dailySalesList } from '../../assets/json';
import { DailySales, dailyKey } from '../../model/DailySales';
import { sum } from '../../../packages/math';
import { colorBy } from '../../modules/calendar';
import { color } from './constants';

type Props = {
  groupedSales: {
    date: string;
    list: (DailySales | null | undefined)[];
  }
}

const tooltipStyle = css`
  font-size: 14px;
`;

const SideBarCellStyle = css`
  position: relative;
  width: 100%;
  height: ${color.HEADER_ROW_HEIGHT}px;
  padding: 10px 20px;
  background-color: ${color.WHITE};
  border-bottom: solid 1px ${color.GRAY};
  border-right: solid 1px ${color.GRAY};
  filter: drop-shadow(0 1px 2px ${color.GRAY});
  box-sizing: border-box;

  .schedule-sidebar_row__title {
    font-size: 16px;
    color: #010101;
  }
`;

const SideBarCell: React.FC<Props> = memo(({ groupedSales }) => {
  const { date, list } = groupedSales;
  const backgroundColor = colorBy(Number(sum(list.filter(item => item).map(item => Number(item?.sales)))) || 0);
  const day = list.filter(item => item)[0]?.day;
  const totalSales = sum(list.filter(item => item).map(item => Number(item?.sales)));
  const targetSales = dailySalesList.filter(item => item.aggregationPeriod === date)[0];
  
  return (
    <Tooltip
      className={SideBarCellStyle}
      placement='right'
      title={
        <div>
          {
            /* eslint-disable-next-line */
            Object.keys(dailyKey).map((key) => <p className={tooltipStyle} key={`toolip-text-${key}`}>{dailyKey[key]}: { targetSales.toObj[dailyKey[key]]}</p>)
          }
        </div>
      }
    >
      <div
        className={SideBarCellStyle}
        style={{ background: backgroundColor }}
      >
        <p className="schedule-sidebar_row__title">{ date }: { day }</p>
        <p>売上:  <span className='bold'>{ totalSales.toLocaleString() }円</span></p>
      </div>
    </Tooltip>
  )
});

export default SideBarCell;
