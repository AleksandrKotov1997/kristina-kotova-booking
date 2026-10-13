import dayjs from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/kk";
import type { BookingCalendar } from "./types";
export const parseCalendarDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
};
export const formatCalendarDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
export const formatBookingDate = (date: string, locale = "ru") =>
  dayjs(date)
    .locale(locale === "kk" ? "kk" : "ru")
    .format("D MMMM YYYY");

export const isBookingDateSelectable = (
  date: string,
  calendar: BookingCalendar,
) =>
  date >= calendar.today &&
  date <= calendar.lastDate &&
  calendar.workingHours.some(
    (hours) =>
      hours.dayOfWeek === (parseCalendarDate(date).getDay() || 7) &&
      hours.isWorkingDay,
  );
