import React, { memo, useState, useCallback, ChangeEvent } from 'react';
import { css } from '@emotion/css';

import { DAYS } from '../modules/calendar';
import { DailySales, dailyKey } from '../model/DailySales';
import TotalCell from './TotalCell';

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

type Option = {
  value: keyof DailySales;
  label: string;
}
const options: Option[] = [{
  label: dailyKey.SALES,
  value: 'sales'
},{
  label: dailyKey.NUMBER_OF_ACCOUNTS,
  value: 'numberOfAccounts'
},{
  label: dailyKey.NUMBER_OF_CUSTOMERS,
  value: 'numberOfCustomers'
},{
  label: dailyKey.AVERAGE_AMOUNT,
  value: 'averageAmount'
},{
  label: dailyKey.NUMBER_OF_PRODUCTS,
  value: 'numberOfProducts'
},{
  label: dailyKey.TOTAL_NO_CASH_PAYMENT,
  value: 'totalNoCashPayment'
},{
  label: dailyKey.TOTAL_CASH_PAYMENT,
  value: 'totalCashPayment'
}];

const style = css`
  display:flex;

  .controller {
    flex-basis: 100px;
  }
  .calendar {
    flex: 1;
    height: 100vh;
    overflow-y: scroll;
  }
`;

const tableStyle = css`
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
  const [dailySalesType, setDailySalesType] = useState<keyof DailySales>('sales');

  const totalByDay = DAYS.map((day, i) => {
    const salesByDay = initialDailySales.filter(item => item?.day === day).map(item => Number(item?.[dailySalesType]))
    return salesByDay
  })

  const handleSelect = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setDailySalesType(e.target.value as keyof DailySales)
  },[])
  
  return (
    <div className={style}>
      <div className='controller'>
        <select name="select" onChange={handleSelect}>
          {
            options.map((option, i) => <option key={`select-${i}`} value={option.value}>{ option.label }</option>)
          }
        </select>
      </div>
      <div className='calendar'>
        <table className={tableStyle}>
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
                  <td key={`col-final`}>
                    <TotalCell list={row.filter(item => item).map(item => Number(item?.sales || 0))} />
                  </td>
                </tr>
              })
            }
            {/* 曜日別合計 */}
            <tr>{
              DAYS.map(day => <td key={`total-${day}`}>{ day } 合計</td>)
            }</tr>
            <tr>
              {
                totalByDay.map((cols,i) => (
                  <td key={`total-day-${i}`}>
                    <TotalCell list={cols} />
                  </td>
                ))
              }
              <td>
                <TotalCell list={totalByDay.flat()} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
})

export default Calendar;
