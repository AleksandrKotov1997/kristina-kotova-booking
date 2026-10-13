import { weekdays, weekdayLabels } from "./constants";
import type { Weekday, WorkingDaySchedule } from "./types";

interface ConsecutiveDaysGroup {
  firstDay: Weekday;
  lastDay: Weekday;
  hoursLabel: string;
}

interface WorkingHoursLabels {
  weekdays: Record<Weekday, string>;
  daily: string;
  unknown: string;
  dayOff: string;
  hours: (start: string, end: string) => string;
}
const russianLabels: WorkingHoursLabels = {
  weekdays: weekdayLabels,
  daily: "Ежедневно",
  unknown: "Уточняется",
  dayOff: "Выходной",
  hours: (start, end) => "с " + start + " до " + end + " часов",
};
export const groupWorkingHours = (
  schedule: WorkingDaySchedule[],
  labels: WorkingHoursLabels = russianLabels,
) => {
  const scheduleByDay = new Map(schedule.map((day) => [day.dayOfWeek, day]));
  const groups: ConsecutiveDaysGroup[] = [];

  for (const weekday of weekdays) {
    const day = scheduleByDay.get(weekday);
    const hoursLabel = !day
      ? labels.unknown
      : day.isWorkingDay
        ? labels.hours(day.startTime, day.endTime)
        : labels.dayOff;
    const previousGroup = groups.at(-1);

    if (previousGroup && previousGroup.hoursLabel === hoursLabel) {
      previousGroup.lastDay = weekday;
    } else {
      groups.push({ firstDay: weekday, lastDay: weekday, hoursLabel });
    }
  }

  const worksEveryDay = weekdays.every(
    (weekday) => scheduleByDay.get(weekday)?.isWorkingDay === true,
  );

  return groups.map((group) => ({
    key: group.firstDay,
    daysLabel:
      worksEveryDay && groups.length === 1
        ? labels.daily
        : group.firstDay === group.lastDay
          ? labels.weekdays[group.firstDay]
          : labels.weekdays[group.firstDay] +
            " – " +
            labels.weekdays[group.lastDay],
    hoursLabel: group.hoursLabel,
  }));
};
