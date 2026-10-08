import { z } from "zod";

export const weekdaySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
]);

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const dayFields = { id: z.uuid(), dayOfWeek: weekdaySchema };

export const workingDaySchema = z.discriminatedUnion("isWorkingDay", [
  z
    .object({
      ...dayFields,
      isWorkingDay: z.literal(true),
      startTime: timeSchema,
      endTime: timeSchema,
    })
    .refine((day) => day.startTime < day.endTime, {
      message: "Начало рабочего дня должно быть раньше окончания.",
    }),
  z.object({
    ...dayFields,
    isWorkingDay: z.literal(false),
    startTime: z.null(),
    endTime: z.null(),
  }),
]);

export const workingHoursSchema = z
  .array(workingDaySchema)
  .max(7)
  .refine(
    (days) => new Set(days.map((day) => day.dayOfWeek)).size === days.length,
    {
      message: "Дни недели не должны повторяться.",
    },
  );

export const workingHoursResponseSchema = z.object({
  data: workingHoursSchema,
});

export const workingHoursQuerySchema = z.strictObject({});
