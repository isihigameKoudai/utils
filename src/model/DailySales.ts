/**
 * 日別集計モデル
 *
 * Airレジの
 * 「売上」=>「日別売り上げ」=>「CSVデータをダウンロードする」で取得したcsvデータに対応
 */
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

  constructor(props: string[]) {
    // 集計期間
    this.aggregationPeriod = props[0];
    // 売り上げ
    this.sales = props[1];
    // 会計数
    this.numberOfAccounts = props[2];
    // 会計単価
    this.accountingUnitPrice = props[3];
    // 客数
    this.numberOfCustomers = props[4];
    // 客単価
    this.averageAmount = props[5];
    // 商品数
    this.numberOfProducts = props[6];
    // 現金支払合計額
    this.totalCashPayment = props[7];
    // 現金その他支払合計額
    this.totalNoCashPayment = props[8];
    // 割引
    this.discount = props[9];
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
