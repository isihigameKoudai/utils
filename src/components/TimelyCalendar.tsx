import * as React from 'react';
import { useRef, useEffect } from 'react';
import { css } from '@emotion/css';
import groupBy from 'just-group-by';

import { HOURS, OPEN_HOURS } from '../modules/calendar';
import { timelySalesList } from '../assets/json';
import { DailySales } from '../model/DailySales';
import { sum } from '../../packages/math';
import { colorBy } from '../modules/calendar';


const style = css`
  width: 100%;
`;

const color = {
  BLACK: '#333',
  GRAY: '#cacaca',
  LIGHT_GRAY: '#eee',
  WHITE: '#fdfdfd',
  FONT_WHITE: '#f0f0f0',
  RED: '#F44336',
  BLUE: '#2196F3',
  GREEN: '#4CAF50',
  ROW_HEIGHT: 60,
  HEADER_ROW_HEIGHT: 72,
  COL_WIDTH: 100
}

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
    height: ${color.HEADER_ROW_HEIGHT}px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .schedule-sidebar {
    width: 200px;
    border-right: solid 1px ${color.LIGHT_GRAY};
    filter: drop-shadow(0 1px 2px ${color.LIGHT_GRAY});
  }

  .schedule-sidebar_row {
    position: relative;
    width: 100%;
    height: ${color.HEADER_ROW_HEIGHT}px;
    padding: 10px 20px;
    background-color: ${color.WHITE};
    border-bottom: solid 1px ${color.GRAY};
    border-right: solid 1px ${color.GRAY};
    filter: drop-shadow(0 1px 2px ${color.GRAY});
    box-sizing: border-box;
  }

  .schedule-sidebar_row__title {
    font-size: 16px;
    color: #010101;
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
    }
    .schedule-totals_row {
      width: calc(100% - 200px);
      overflow-x: scroll;
      position: absolute;
      left: 200px;
      display: flex;
      
      .schedule-totals_col {
        position: relative;
        width: ${color.COL_WIDTH}px;
        min-width: ${color.COL_WIDTH}px;
        background: inherit;
        border-right: solid 1px ${color.LIGHT_GRAY};
        border-bottom:  solid 1px ${color.LIGHT_GRAY};
        height: ${color.HEADER_ROW_HEIGHT}px;
        box-sizing: border-box;

        display: flex;
        justify-content: center;
        align-items: center;
      }
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
              dailySales2D.map(({ date, list },i) => {
                const backgroundColor = colorBy(Number(sum(list.filter(item => item).map(item => Number(item?.sales)))) || 0);
                const day = list.filter(item => item)[0]?.day;
                const totalSales = sum(list.filter(item => item).map(item => Number(item?.sales)));
                
                return (
                  <div
                    className="schedule-sidebar_row"
                    key={`sidebar-row-${i}`}
                    style={{ background: backgroundColor }}
                  >
                    <p className="schedule-sidebar_row__title">{ date }: { day }</p>
                    <p>売上:  <span className='bold'>{ totalSales.toLocaleString() }円</span></p>
                  </div>
                )
              })
            }
          </div>
          <div
            className="schedule-container"
            ref={$scheduleContainer}
            style={{ height: `${dailySales2D.length * color.HEADER_ROW_HEIGHT + 1}px` }}
          >
            {
              dailySales2D.map(({ list },i) => (
                <div className="schedule-content__row" key={`schedule-col-${i}`}>
                  {
                    list.map((hourItem,j) => {
                      const sales = hourItem && Number(hourItem?.sales).toLocaleString();
                      return (
                        <div
                          className="schedule-content__col"
                          key={`schedule-col-${i}-${j}`}
                        >{sales && `${sales}円`}</div>
                      )
                    })
                  }
                </div>
              ))
            }
          </div>
        </div>
        <div className='schedule-totals'>
          <div className='schedule-totals_sidebar' />
          <div className='schedule-totals_row' ref={$scheduleTotalsRow}>
            {
              totalDailySales.map((total,i) => (
                <div className='schedule-totals_col' key={`schedule-totals_col-${i}`}>{ total }</div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default TimelyCalendar;
