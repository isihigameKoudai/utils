export const csv2array = (csv: string) =>
  csv
    .replaceAll("\r", "")
    .split("\n")
    .map((row) => row.split(","));
