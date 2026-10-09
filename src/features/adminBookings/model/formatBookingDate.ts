const bookingDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
// Дата заявки — календарный день студии; не сдвигаем её часовым поясом браузера.
export const formatBookingDate = (date: string) =>
  bookingDateFormatter.format(new Date(date + "T12:00:00Z"));
