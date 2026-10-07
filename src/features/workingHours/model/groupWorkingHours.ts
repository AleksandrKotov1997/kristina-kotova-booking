import { weekdays, weekdayLabels } from "./constants";
import type { Weekday, WorkingDaySchedule } from "./types";

interface ConsecutiveDaysGroup {
  firstDay: Weekday;
  lastDay: Weekday;
  hoursLabel: string;
}

export const groupWorkingHours = (schedule: WorkingDaySchedule[]) => {
  const scheduleByDay = new Map(schedule.map((day) => [day.dayOfWeek, day]));
  const groups: ConsecutiveDaysGroup[] = [];

  for (const weekday of weekdays) {
    const day = scheduleByDay.get(weekday);
    const hoursLabel = !day
      ? "Уточняется"
      : day.isWorkingDay
        ? day.startTime + " – " + day.endTime
        : "Выходной";
    const previousGroup = groups.at(-1);

    if (previousGroup && previousGroup.hoursLabel === hoursLabel) {
      previousGroup.lastDay = weekday;
    } else {
      groups.push({ firstDay: weekday, lastDay: weekday, hoursLabel });
    }
  }

  return groups.map((group) => ({
    key: group.firstDay,
    daysLabel:
      group.firstDay === group.lastDay
        ? weekdayLabels[group.firstDay]
        : weekdayLabels[group.firstDay] + " – " + weekdayLabels[group.lastDay],
    hoursLabel: group.hoursLabel,
  }));
};
