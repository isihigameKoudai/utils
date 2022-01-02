import { useState } from 'react'
import './App.css'

import { DailySales } from './model/DailySales';
import { DAYS, subDates } from './modules/calendar';
import Calendar from './components/Calendar';
import { dailySalesList } from './assets/json'

function App() {
  const startDailySales = dailySalesList[0];
  const startDay = DAYS.indexOf(startDailySales.day)
  const endDailySales = dailySalesList[dailySalesList.length - 1];
  const sub = subDates(startDailySales.aggregationPeriod, endDailySales.aggregationPeriod);
  const weeks: (DailySales | undefined)[][] = [...new Array(Math.ceil(sub / 7))].map(() => [...new Array(7)].map(() => undefined));

  dailySalesList.forEach(dailySales => {
    const col = DAYS.indexOf(dailySales.day);
    const row = Math.floor((subDates(startDailySales.aggregationPeriod, dailySales.aggregationPeriod) + startDay) / 7);
    // console.log(row);
    weeks[row][col] = dailySales;
  })
  const [calendarTable, setCalendarTable] = useState<(DailySales | undefined)[][]>(weeks) 

  return (
    <div className="App">
      <Calendar dailySales2D={calendarTable} />
    </div>
  )
}

export default App
