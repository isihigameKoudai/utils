/**
 * 日別集計モデル
 *
 * Airレジの
 * 「売上」=>「日別売り上げ」=>「CSVデータをダウンロードする」で取得したcsvデータに対応
 */
import format from "date-fns/format";
import ja from "date-fns/locale/ja";

import { divideDate } from "../../packages/date";

const AGGREGATION_PERIOD = "集計期間" as const;
const SALES = "売上" as const;
const NUMBER_OF_ACCOUNTS = "会計数" as const;
const ACCOUNTING_UNIT_PRICE = "会計単価" as const;
const NUMBER_OF_CUSTOMERS = "客数" as const;
const AVERAGE_AMOUNT = "客単価" as const;
const NUMBER_OF_PRODUCTS = "商品数" as const;
const TOTAL_CASH_PAYMENT = "現金支払合計額" as const;
const TOTAL_NO_CASH_PAYMENT = "現金その他支払合計額" as const;
const DISCOUNT = "割引額" as const;

export const dailyKey = {
  AGGREGATION_PERIOD,
  SALES,
  NUMBER_OF_ACCOUNTS,
  NUMBER_OF_CUSTOMERS,
  AVERAGE_AMOUNT,
  NUMBER_OF_PRODUCTS,
  TOTAL_CASH_PAYMENT,
  TOTAL_NO_CASH_PAYMENT,
  DISCOUNT,
};

type Props = {
  [AGGREGATION_PERIOD]: string;
  [SALES]: string;
  [NUMBER_OF_ACCOUNTS]: string;
  [ACCOUNTING_UNIT_PRICE]: string;
  [NUMBER_OF_CUSTOMERS]: string;
  [AVERAGE_AMOUNT]: string;
  [NUMBER_OF_PRODUCTS]: string;
  [TOTAL_CASH_PAYMENT]: string;
  [TOTAL_NO_CASH_PAYMENT]: string;
  [DISCOUNT]: string;
};

export class DailySales {
  aggregationPeriod: string;
  sales: string;
  numberOfAccounts: string;
  accountingUnitPrice: string;
  numberOfCustomers: string;
  averageAmount: string;
  numberOfProducts: string;
  totalCashPayment: string;
  totalNoCashPayment: string;
  discount: string;

  constructor(props: Props) {
    // 集計期間
    this.aggregationPeriod = props[AGGREGATION_PERIOD];
    // 売り上げ
    this.sales = props[SALES];
    // 会計数
    this.numberOfAccounts = props[NUMBER_OF_ACCOUNTS];
    // 会計単価
    this.accountingUnitPrice = props[ACCOUNTING_UNIT_PRICE];
    // 客数
    this.numberOfCustomers = props[NUMBER_OF_CUSTOMERS];
    // 客単価
    this.averageAmount = props[AVERAGE_AMOUNT];
    // 商品数
    this.numberOfProducts = props[NUMBER_OF_PRODUCTS];
    // 現金支払合計額
    this.totalCashPayment = props[TOTAL_CASH_PAYMENT];
    // 現金その他支払合計額
    this.totalNoCashPayment = props[TOTAL_NO_CASH_PAYMENT];
    // 割引
    this.discount = props[DISCOUNT];
  }

  /**
   * 日付の曜日を返す
   */
  get day() {
    const { year, month, day } = divideDate(this.aggregationPeriod);
    return format(new Date(year, month - 1, day), "cccc", {
      locale: ja,
    });
  }

  get date() {
    const { year, month, day, hour = 0 } = divideDate(this.aggregationPeriod);
    return { year, month, day, hour };
  }

  get toObj() {
    return {
      [AGGREGATION_PERIOD]: this.aggregationPeriod,
      [SALES]: this.sales,
      [NUMBER_OF_ACCOUNTS]: this.numberOfAccounts,
      [ACCOUNTING_UNIT_PRICE]: this.accountingUnitPrice,
      [NUMBER_OF_CUSTOMERS]: this.numberOfCustomers,
      [AVERAGE_AMOUNT]: this.averageAmount,
      [NUMBER_OF_PRODUCTS]: this.numberOfProducts,
      [TOTAL_CASH_PAYMENT]: this.totalCashPayment,
      [TOTAL_NO_CASH_PAYMENT]: this.totalNoCashPayment,
      [DISCOUNT]: this.discount,
    };
  }
}
