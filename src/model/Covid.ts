type Props = {
  date: string;
  name_jp: string;
  npatients: string;
};

class Covid {
  date: {
    year: number;
    month: number;
    day: number;
  };
  prefecture: string;
  inpatients: number;
  newInpatient: number;
  constructor({ date, name_jp, npatients }: Props) {
    const [year, month, day] = date.split("-").map((item) => Number(item));
    this.date = {
      year,
      month,
      day,
    };
    this.prefecture = name_jp;
    this.inpatients = Number(npatients);
    this.newInpatient = 0;
  }
}

export default Covid;
