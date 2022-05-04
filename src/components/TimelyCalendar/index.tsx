import * as React from 'react';
import { useRef, useEffect } from 'react';
import { css } from '@emotion/css';
import groupBy from 'just-group-by';

import { HOURS, OPEN_HOURS } from '../../modules/calendar';
import { timelySalesList } from '../../assets/json';
import { DailySales } from '../../model/DailySales';
import { sum } from '../../../packages/math';
import { timelyColorBy } from '../../modules/calendar';
import { color } from './constants';
import SideBarCell from './SideBarCell';
import TotalCell from './TotalCell';

const style = css`
  width: 100%;
`;

const scheduleStyle = css`
  p {
    margin: 0;
  }

  width: 100%;
  border: solid 1px ${color.LIGHT_GRAY};

  .hide-box {
    width: 200px;
    height: 40px;
    background: ${color.LIGHT_GRAY};
  }

  .header__col {
    position: relative;
    width: ${color.COL_WIDTH}px;
    min-width: ${color.COL_WIDTH}px;
    padding: 0 16px;
    font-size: 20px;
    color: ${color.BLACK};
    white-space: nowrap;
    background: ${color.WHITE};
    border: solid 1px ${color.LIGHT_GRAY};
    box-sizing: border-box;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .schedule__header {
    display: flex;
    width: 100%;
    border-bottom: solid 1px #eee;
    filter: drop-shadow(0 1px 2px #ddd);
  }

  .header-view {
    width: calc(100% - 200px);
    overflow-x: scroll;
    display: flex;
  }

  .header-view::-webkit-scrollbar {
    display: none;
  }


  .schedule-container {
    width: calc(100% - 200px);
    overflow-x: scroll;
    position: absolute;
    left: 200px;

  }

  .schedule-content__row {
    display: flex;
    width: calc(24 * ${color.COL_WIDTH}px);
    height: ${color.HEADER_ROW_HEIGHT}px;
  }

  .schedule-content__col {
    position: relative;
    width: ${color.COL_WIDTH}px;
    background: inherit;
    border-right: solid 1px ${color.LIGHT_GRAY};
    border-bottom: solid 1px ${color.LIGHT_GRAY};
    box-sizing: border-box;
    height: ${color.HEADER_ROW_HEIGHT}px;
    text-align: center;
    padding: 8px 0;
  }

  .schedule-sidebar {
    width: 200px;
    border-right: solid 1px ${color.LIGHT_GRAY};
    filter: drop-shadow(0 1px 2px ${color.LIGHT_GRAY});
  }

  .schedule__view {
    position: relative;
    overflow-y: scroll;
    height: calc(100vh - 85px - ${color.HEADER_ROW_HEIGHT}px);
    width: 100%;
    display: flex;
  }

  .schedule-totals {
    position: relative;
    width: 100%;
    display: flex;
    border-top: solid 1px ${color.GRAY};
    background: ${color.WHITE};
    filter: drop-shadow(0 -2px 2px ${color.GRAY});

    .schedule-totals_sidebar {
      width: 200px;
      height: ${color.HEADER_ROW_HEIGHT}px;
      box-sizing: border-box;
      border: solid 1px ${color.LIGHT_GRAY};
    }
    .schedule-totals_row {
      width: calc(100% - 200px);
      overflow-x: scroll;
      position: absolute;
      left: 200px;
      display: flex;
    }
  }

  .bold {
    font-weight: bold;
  }
`;

const groupedTimelySalesList = groupBy(timelySalesList, (item) => {
  return Number(`${item['date']['year']}${item['date']['month'].toString().padStart(2,'0')}${item['date']['day'].toString().padStart(2,'0')}`);
});

const dailySales2D = Object.keys(groupedTimelySalesList).map(key => ({
  date:key,
  list: groupedTimelySalesList[key],
})).map(({ list, date }) => {
  return {
    date: date,
    list: HOURS.map(hour => {
      const existSales: number[] = list.map((hourItem: DailySales) => hourItem.date.hour);
      const hasHour = existSales.includes(hour);
      if(!hasHour) {
        return null;
      }
      const targetSales = list.find((hourItem: DailySales) => hourItem.date.hour === hour);
      return targetSales
    })
  }
});

const totalDailySales = HOURS.map((hour) => {
  const sales = timelySalesList.filter((item: DailySales) => item.date.hour === hour);
  return sales.length > 0 ? sum(sales.map((item: DailySales) => Number(item.sales))) : 0;
});

const TimelyCalendar: React.FC = () => {
  const $headerView = useRef<HTMLDivElement>(null);
  const $scheduleContainer = useRef<HTMLDivElement>(null);
  const $scheduleTotalsRow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    $headerView.current?.addEventListener('scroll', (e) => {
      $scheduleContainer.current!.scrollLeft = e.target!.scrollLeft;
      $scheduleTotalsRow.current!.scrollLeft = e.target!.scrollLeft;
    })
    $scheduleContainer.current?.addEventListener('scroll', e => {
      $headerView.current!.scrollLeft = e.target!.scrollLeft;
      $scheduleTotalsRow.current!.scrollLeft = e.target!.scrollLeft;
    });

    $scheduleTotalsRow.current?.addEventListener('scroll', e => {
      $headerView.current!.scrollLeft = e.target!.scrollLeft;
      $scheduleContainer.current!.scrollLeft = e.target!.scrollLeft;
    });

    $scheduleContainer.current!.scrollLeft = OPEN_HOURS * color.COL_WIDTH;
    $scheduleTotalsRow.current!.scrollLeft = OPEN_HOURS * color.COL_WIDTH;
  },[])

  return (
    <div className={style}>
      <div className={scheduleStyle}>
        <div className="schedule__header">
          <div className="hide-box" />
          <div className="header-view" ref={$headerView}>
            {
              HOURS.map((hour, i) => (
                <div
                  className="header__col"
                  key={`header-col-${i}`}
                >{`${hour}:00`}</div>
              ))
            }
          </div>
        </div>
        <div className="schedule__view">
          <div className="schedule-sidebar">
            {
              dailySales2D.map(({ date, list },i) => <SideBarCell key={`sidebar-row-${i}`}  groupedSales={{ date, list }} />)
            }
          </div>
          <div
            className="schedule-container"
            ref={$scheduleContainer}
            style={{ height: `${dailySales2D.length * color.HEADER_ROW_HEIGHT + 1}px` }}
          >
            {
              dailySales2D.map(({ list },i) => {
                const totalSales = sum(list.filter(item => item).map(item => Number(item?.sales)));
                return (
                  <div className="schedule-content__row" key={`schedule-col-${i}`}>
                    {
                      list.map((hourItem,j) => {
                        const sales = hourItem && Number(hourItem?.sales).toLocaleString();
                        const background = timelyColorBy(Number(hourItem?.sales));
                        const percentage = ((Number(hourItem?.sales) / totalSales) * 100).toFixed(2);
                        return (
                          <div
                            className="schedule-content__col"
                            key={`schedule-col-${i}-${j}`}
                            style={{ background }}
                          >
                            <p>{sales && `${sales}円`}</p>
                            <p>{ sales && `（${percentage}%）` }</p>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='schedule-totals'>
          <div className='schedule-totals_sidebar' />
          <div className='schedule-totals_row' ref={$scheduleTotalsRow}>
            {
              totalDailySales.map((total,i) => (
                <TotalCell
                  totalPerHour={total}
                  totalDailySales={totalDailySales}
                  key={`schedule-totals_col-${i}`}
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default TimelyCalendar;
