import { useState } from 'react'
import { addDays, format } from 'date-fns';
import { css } from '@emotion/css';

import { DailySales } from './model/DailySales';
import { DAYS, subDates } from './modules/calendar';
import { dailySalesList, covidList } from './assets/json';
import { divideDate } from '../packages/date'
import Calendar from './components/Calendar';
import Chart from './components/Chart';
import TimelyCalendar from './components/TimelyCalendar';

const style = css`
  width: 1100px;
  margin: 0 auto;
`;

function App() {
  const startDailySales = dailySalesList[0];
  const startDay = DAYS.indexOf(startDailySales.day)
  const endDailySales = dailySalesList[dailySalesList.length - 1];
  const sub = subDates(startDailySales.aggregationPeriod, endDailySales.aggregationPeriod);
  // カレンダーテーブルの作成
  const weeks: (DailySales | undefined)[][] = [...new Array(Math.ceil(sub / 7))].map(() => [...new Array(7)].map(() => undefined));
  const { year, month, day } = divideDate(startDailySales.aggregationPeriod)
  const tempStartDate = addDays(new Date(year, month - 1, day), - startDay)
  
  weeks.forEach((row, i) => {
    row.forEach((_,j) => {
      const ex = i * 7 + j;
      const addedDay = addDays(tempStartDate, ex);
      const day = format(addedDay, 'yyyyMMdd');
      weeks[i][j] = dailySalesList.filter(dailySales => dailySales.aggregationPeriod === day)[0] || undefined;
    })
  })
  const [calendarTable, setCalendarTable] = useState<(DailySales | undefined)[][]>(weeks) 
  const initialDailySales = weeks.flat().filter(item => item);

  const [viewMode, setViewMode] = useState<'calendar' | 'chart' | 'timely'>('timely');
  

  return (
    <div className={style}>
      <header>
        <button type='button' onClick={() => setViewMode('calendar')}>カレンダー</button>
        <button type='button' onClick={() => setViewMode('timely')}>カレンダー（時間別）</button>
        <button type='button' onClick={() => setViewMode('chart')}>チャート</button>
      </header>
      {
        viewMode === 'calendar' && <Calendar dailySales2D={calendarTable} />
      }
      {
        viewMode === 'timely' && <TimelyCalendar />
      }
      {
        viewMode === 'chart' && <Chart dailySales={initialDailySales} covidList={covidList} />
      }
    </div>
  )
}

export default App
