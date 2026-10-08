import type { Weekday } from "./types";

export const workingHoursQueryKey = ["working-hours"];
export const weekdays: Weekday[] = [1, 2, 3, 4, 5, 6, 7];
export const weekdayLabels: Record<Weekday, string> = {
  1: "Пн",
  2: "Вт",
  3: "Ср",
  4: "Чт",
  5: "Пт",
  6: "Сб",
  7: "Вс",
};
