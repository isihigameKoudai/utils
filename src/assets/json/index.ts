import { DailySales } from "../../model/DailySales";
import Covid from "../../model/Covid";

// 月別データ
import csv2021 from "./2021.json";
import csv2022 from "./2022.json";
// 時間別データ
import timely2021 from "./csv2021/";
import timely2022 from "./csv2022/";

// 感染者データ
// 引用 https://corona.go.jp/dashboard/
import covidAll from "./covidAll.json";

// 祝日データ
// 引用 https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html
import holiday from "./holiday.json";
import Holiday from "../../model/Holiday";

// 日別売り上げ
export const dailySalesList: DailySales[] = [...csv2021, ...csv2022].map(
  (item) => new DailySales(item)
);

// 時間別売り上げ
export const timelySalesList: DailySales[] = [...timely2021, ...timely2022].map(
  (item) => new DailySales(item)
);

// 祝日データ
export const HolidayList: Holiday[] = holiday.map((item) => new Holiday(item));
console.log(HolidayList);

// 県別感染者数（20200422 ~ 20220331）
export const covidList: Covid[] = covidAll.itemList.map(
  (item) => new Covid(item)
);
