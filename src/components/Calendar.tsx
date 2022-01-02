import React, { memo, useCallback } from 'react';
import { css } from '@emotion/css';

import { DAYS, subDates } from '../modules/calendar';
import { DailySales } from '../model/DailySales';
import CalendarCell from './CalendarCell';

type Props = {
  dailySales2D: (DailySales | undefined)[][]
}

const colorBy = (sales:number): string => {
  if(50000 < sales) return '#B71C1C' ;
  if(45000 < sales) return '#C62828';
  if(40000 < sales) return '#D32F2F';
  if(35000 < sales) return '#E53935';
  if(30000 < sales) return '#F44336';
  if(25000 < sales) return '#EF5350';
  if(20000 < sales) return '#E57373';
  if(15000 < sales) return '#EF9A9A';
  if(10000 < sales) return '#FFCDD2';
  if(5000 < sales) return '#FFEBEE';

  return '#fff';
};

const style = css`
  width: 100%;
  border-collapse:  collapse;

  th,td {
    padding: 8px 10px;
    border: solid 1px #ddd;

    &:nth-child(2n) {
      background: solid 1px #fcfcfc;
    }
  }

  tr {
    &:last-child {
      border-top: solid 2px #888;
    }
  }

  thead {
    border-bottom: solid 2px #888;
  }
`;

const Calendar: React.FC<Props> = memo(({ dailySales2D }) => {
  const initialDailySales = dailySales2D.flat().filter(item => item);

  const totalByDay = DAYS.map((day, i) => {
    const salesByDay = initialDailySales.filter(item => item?.day === day).map(item => Number(item?.sales))
    return salesByDay.reduce((sum, el) => sum + el);
  })
  
  return (
    <>
      <div>
        <select name="select">
          {
            DAYS.map((day, i) => <option key={`select-${i}`} value={i}>{ day }</option>)
          }
        </select>
      </div>
      <table className={style}>
        <thead>
          <tr>
            {
              DAYS.map(day => <th key={`header-${day}`}>{ day }</th>)
            }
            <th>分析</th>
          </tr>
        </thead>
        <tbody>
          {
            dailySales2D.map((row, i) => {
              return <tr key={`row-${i}`}>{
                row.map((col, j) => (
                  <td style={{ background: colorBy(Number(col?.sales) || 0) }} key={`col-${j}`}>
                    <p>{ col && col.aggregationPeriod }</p>
                    <span>{ col && `${Number(col.sales).toLocaleString()}円` }</span>
                  </td>
                ))
              }
                <td>
                  <CalendarCell list={row.filter(item => item).map(item => Number(item?.sales || 0))} />
                </td>
              </tr>
            })
          }
          {/* 曜日別合計 */}
          <tr>{
            DAYS.map(day => <td>{ day } 合計</td>)
          }</tr>
          <tr>
            {
              totalByDay.map((col,i) => <td key={`total-${i}`}>
                <span>{ col.toLocaleString() }</span>
              </td>)
            }
            <td>
              <CalendarCell list={totalByDay} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
})

export default Calendar;
