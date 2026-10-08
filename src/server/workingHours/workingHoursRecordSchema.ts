import { z } from "zod";
import { weekdaySchema } from "@/features/workingHours/model/schemas";

const databaseTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:00$/);

export const workingHoursRecordSchema = z.object({
  id: z.uuid(),
  day_of_week: weekdaySchema,
  start_time: databaseTimeSchema.nullable(),
  end_time: databaseTimeSchema.nullable(),
  is_working_day: z.boolean(),
});

export type WorkingHoursRecord = z.infer<typeof workingHoursRecordSchema>;
