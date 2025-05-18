import dayjs, { Dayjs } from "dayjs";

import { isTruthy } from '@/utils/guards';

export type BillProps = [string, string, string];

export class Bill {
  readonly date: Dayjs;
  readonly amount: number;
  readonly store: string;

  /**
   * @example
   * const bill = new Bill([
   *  '2021-01-01',
   *  'store1',
   *  '1,000'
   * ]);
   */
  constructor(props: BillProps) {
    const { date, amount, store } = this.validate(props);
    
    this.date = date;
    this.store = store;
    this.amount = amount;
  }

  validate(props: BillProps) {
    if (props.length !== 3) {
      throw new Error('props is invalid');
    }

    // 日付の形（カンマ区切り、ハイフン区切り、yyyyMMdd）かどうかを判定
    if (!dayjs(props[0]).isValid()) {
      throw new Error('Invalid date format');
    }

    if (props[1] === '') {
      throw new Error('Invalid store format');
    }

    if (!Number.isInteger(Number(props[2]))) {
      throw new Error('Invalid amount format');
    }

    return {
      date: dayjs(props[0]),
      store: props[1],
      amount: Number(props[2]),
    }
  }

  get dateLabel(): string {
    return this.date.format('YYYY-MM-DD');
  }

  get amountLabel(): string {
    return `${this.amount.toLocaleString()}円`;
  }

  static isEmpty(props: [string, string, string]): boolean {
    return !isTruthy(props[0]) || !isTruthy(props[1]);
  }
}
