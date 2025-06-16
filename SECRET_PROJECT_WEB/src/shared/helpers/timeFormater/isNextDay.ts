import dayjs from "dayjs";

export const isNextDay = (date1: string, date2: string) => {
  return !dayjs(date1).isSame(dayjs(date2), "day");
};
