import { workingDaySchema } from "@/features/workingHours/model/schemas";
import type { WorkingHoursRecord } from "../workingHoursRecordSchema";

export const transformWorkingHours = (record: WorkingHoursRecord) =>
  workingDaySchema.parse({
    id: record.id,
    dayOfWeek: record.day_of_week,
    startTime: record.start_time?.slice(0, 5) ?? null,
    endTime: record.end_time?.slice(0, 5) ?? null,
    isWorkingDay: record.is_working_day,
  });
