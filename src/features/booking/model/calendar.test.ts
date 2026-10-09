import type { BookingCalendar } from "./types";
import { describe, expect, it } from "vitest";
import {
  formatBookingDate,
  formatCalendarDate,
  isBookingDateSelectable,
  parseCalendarDate,
} from "./calendar";
describe("studio calendar dates", () => {
  it.each(["2026-10-09", "2026-12-31", "2027-01-01", "2028-02-29"])(
    "preserves calendar date %s without converting to UTC",
    (date) => {
      expect(formatCalendarDate(parseCalendarDate(date))).toBe(date);
    },
  );
  it("formats the date in Russian", () =>
    expect(formatBookingDate("2026-10-10")).toContain("10 октября 2026"));
});

const workingCalendar: BookingCalendar = {
  timeZone: "Asia/Almaty",
  today: "2026-10-09",
  lastDate: "2027-01-06",
  workingHours: [
    {
      id: "f9000000-0000-4000-8000-000000000001",
      dayOfWeek: 6,
      isWorkingDay: true,
      startTime: "10:00",
      endTime: "20:00",
    },
  ],
};
describe("selectable booking days", () => {
  it("allows a working Saturday", () =>
    expect(isBookingDateSelectable("2026-10-10", workingCalendar)).toBe(true));
  it("disables a day without working hours", () =>
    expect(isBookingDateSelectable("2026-10-11", workingCalendar)).toBe(false));
  it("disables dates before and after the booking window", () => {
    expect(isBookingDateSelectable("2026-10-03", workingCalendar)).toBe(false);
    expect(isBookingDateSelectable("2027-01-09", workingCalendar)).toBe(false);
  });
});
