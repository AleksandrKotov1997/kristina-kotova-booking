import { describe, expect, it } from "vitest";
import { weekdays } from "./constants";
import { groupWorkingHours } from "./groupWorkingHours";
import { workingDaySchema } from "./schemas";
import type { Weekday } from "./types";

const workingDay = (
  dayOfWeek: Weekday,
  startTime = "18:00",
  endTime = "21:00",
) =>
  workingDaySchema.parse({
    id: "00000000-0000-4000-8000-00000000000" + dayOfWeek,
    dayOfWeek,
    isWorkingDay: true,
    startTime,
    endTime,
  });

describe("groupWorkingHours", () => {
  it("показывает неделю по порядку и объединяет одинаковые соседние часы", () => {
    const schedule = weekdays
      .map((day) =>
        day <= 5 ? workingDay(day) : workingDay(day, "10:00", "20:00"),
      )
      .reverse();

    expect(groupWorkingHours(schedule)).toEqual([
      { key: 1, daysLabel: "Пн – Пт", hoursLabel: "18:00 – 21:00" },
      { key: 6, daysLabel: "Сб – Вс", hoursLabel: "10:00 – 20:00" },
    ]);
  });

  it("различает выходной и день без настроенного расписания", () => {
    const closedWednesday = workingDaySchema.parse({
      id: "00000000-0000-4000-8000-000000000003",
      dayOfWeek: 3,
      isWorkingDay: false,
      startTime: null,
      endTime: null,
    });

    expect(groupWorkingHours([workingDay(5), closedWednesday])).toEqual([
      { key: 1, daysLabel: "Пн – Вт", hoursLabel: "Уточняется" },
      { key: 3, daysLabel: "Ср", hoursLabel: "Выходной" },
      { key: 4, daysLabel: "Чт", hoursLabel: "Уточняется" },
      { key: 5, daysLabel: "Пт", hoursLabel: "18:00 – 21:00" },
      { key: 6, daysLabel: "Сб – Вс", hoursLabel: "Уточняется" },
    ]);
  });

  it("не объединяет воскресенье и понедельник через границу недели", () => {
    expect(groupWorkingHours([workingDay(7), workingDay(1)])).toEqual([
      { key: 1, daysLabel: "Пн", hoursLabel: "18:00 – 21:00" },
      { key: 2, daysLabel: "Вт – Сб", hoursLabel: "Уточняется" },
      { key: 7, daysLabel: "Вс", hoursLabel: "18:00 – 21:00" },
    ]);
  });
});
