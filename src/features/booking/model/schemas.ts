import { z } from "zod";
import { bookingStatusSchema } from "./bookingStatus";
import { workingHoursSchema } from "@/features/workingHours/model/schemas";

export const bookingDateSchema = z.iso.date();
export const bookingTimeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const bookingContactsSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, "Укажите имя, минимум 2 буквы.")
    .max(100, "Имя слишком длинное.")
    .regex(
      /^\p{L}[\p{L}\p{M} '-]*$/u,
      "Используйте буквы, пробел, дефис или апостроф.",
    ),
  clientPhone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[ ()-]/g, ""))
    .pipe(
      z
        .string()
        .regex(
          /^\+[1-9]\d{10,14}$/,
          "Введите телефон с кодом страны, например +7 701 123 45 67.",
        ),
    ),
});
export const createBookingSchema = z.strictObject({
  ...bookingContactsSchema.shape,
  serviceId: z.uuid(),
  date: bookingDateSchema,
  startTime: bookingTimeSchema,
  requestId: z.uuid(),
});
export const bookingAvailabilityQuerySchema = z.strictObject({
  serviceId: z.uuid(),
  date: bookingDateSchema,
});
export const bookingSlotSchema = z
  .object({
    startTime: bookingTimeSchema,
    endTime: bookingTimeSchema,
    isAvailable: z.boolean(),
  })
  .refine((slot) => slot.startTime < slot.endTime);
export const bookingCalendarSchema = z
  .object({
    timeZone: z.string().min(1),
    today: bookingDateSchema,
    lastDate: bookingDateSchema,
    workingHours: workingHoursSchema,
  })
  .refine((calendar) => calendar.today <= calendar.lastDate);
export const bookingAvailabilitySchema = z.object({
  date: bookingDateSchema,
  timeZone: z.string().min(1),
  slots: z.array(bookingSlotSchema),
});
export const bookingReceiptSchema = z.object({
  id: z.uuid(),
  status: bookingStatusSchema,
  date: bookingDateSchema,
  startTime: bookingTimeSchema,
  endTime: bookingTimeSchema,
  serviceName: z.string().min(1),
  servicePrice: z.number().nonnegative(),
  durationMinutes: z.number().int().positive(),
});
export const bookingCalendarResponseSchema = z.object({
  data: bookingCalendarSchema,
});
export const bookingAvailabilityResponseSchema = z.object({
  data: bookingAvailabilitySchema,
});
export const bookingReceiptResponseSchema = z.object({
  data: bookingReceiptSchema,
});
