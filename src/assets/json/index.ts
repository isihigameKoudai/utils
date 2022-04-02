import { DailySales } from "../../model/DailySales";
import Covid from "../../model/Covid";

import csv2021 from "./2021.json";
import csv2022 from "./2022.json";

import covidAll from "./covidAll.json";

// 日別売り上げ
export const dailySalesList: DailySales[] = [...csv2021, ...csv2022].map(
  (item) => new DailySales(item)
);

// 県別感染者数（20200422 ~ 20220331）
// 引用 https://corona.go.jp/dashboard/
export const covidList: Covid[] = covidAll.itemList.map(
  (item) => new Covid(item)
);
