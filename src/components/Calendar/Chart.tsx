import React, { memo, useEffect, useMemo } from 'react';
import { css } from '@emotion/css';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { DailySales } from '../model/DailySales';
import Covid from '../model/Covid';

type Props = {
  dailySales:
   (DailySales | undefined)[];
   covidList: Covid[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const style = css`
  p {
    margin: 0;
  }

  .date {
    font-size: 20px;
  }
`;



const Chart: React.FC<Props> = memo(({ dailySales, covidList }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };
  const infecteds = useMemo(() => dailySales.map(item => {
    const target = covidList.filter(covidListItem => {
      const { year = 0, month = 0, day = 0 } = item!.date;
      return (covidListItem.date.year === year && covidListItem.date.month === month && covidListItem.date.day === day) && covidListItem.prefecture === '青森県'
    });
    return target[0]
  }),[]);

  let compares = [0];
  for(let i = 1; i < infecteds.length; i++) {
    const compare = infecteds[i].inpatients - infecteds[i - 1].inpatients;
    compares = [...compares, compare];
  }
  infecteds.map((item, i) => {
    item.newInpatient = compares[i];
    return item;
  })
  
  const data = {
    labels: dailySales.map(item =>  item?.aggregationPeriod),
    datasets: [
      {
      label: '売上',
      data: dailySales.map(salesItem => {
        salesItem
        if(!salesItem) return 0;
        return salesItem.sales;
      }),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  const data2 = {
    labels: dailySales.map(item =>  item?.aggregationPeriod),
    datasets: [{
      label: '新規感染者数',
      data: infecteds.map(item => item.newInpatient),
      backgroundColor: 'rgba(53, 235, 114, 0.5)',
    },{
      label: '感染者数推移',
      data: infecteds.map(item => item.inpatients),
      backgroundColor: 'rgba(235, 53, 53, 0.5)',
    }]
  }

  return (
    <div className={style}>
      <Bar options={options} data={data} />
      <Bar options={options} data={data2} />
    </div>
  )
})

export default Chart;
