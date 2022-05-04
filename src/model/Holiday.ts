const HOLIDAY_DATE = "国民の祝日・休日月日" as const;
const HOLIDAY_NAME = "国民の祝日・休日名称" as const;

type Props = {
  [HOLIDAY_DATE]: string;
  [HOLIDAY_NAME]: string;
};

class Holiday {
  holidayDate: string;
  holidayName: string;

  constructor(props: Props) {
    this.holidayDate = props[HOLIDAY_DATE];
    this.holidayName = props[HOLIDAY_NAME];
  }

  get date() {
    const [year, month, day] = this.holidayDate.split("/").map(Number);
    return { year, month, day };
  }
}

export default Holiday;
