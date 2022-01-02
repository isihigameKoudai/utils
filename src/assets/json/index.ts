import { DailySales } from "../../model/DailySales";

import csv2021 from "./2021.json";

export const dailySalesList: DailySales[] = csv2021.map(
  (item) => new DailySales(item)
);
