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
const bookingDateFormatter = new Intl.DateTimeFormat("ru-KZ", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
export const formatBookingDate = (date: string) =>
  bookingDateFormatter.format(parseCalendarDate(date));

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
