import { z } from "zod";
import {
  bookingDateSchema,
  bookingTimeSchema,
} from "@/features/booking/model/schemas";
import {
  bookingStatusSchema,
  canChangeBookingStatus,
} from "@/features/booking/model/bookingStatus";

export const adminBookingSchema = z
  .strictObject({
    id: z.uuid(),
    serviceId: z.uuid(),
    serviceName: z.string().min(1),
    servicePrice: z.number().nonnegative(),
    clientName: z.string().min(1),
    clientPhone: z.string().regex(/^\+[1-9]\d{10,14}$/),
    date: bookingDateSchema,
    startTime: bookingTimeSchema,
    endTime: bookingTimeSchema,
    status: bookingStatusSchema,
    createdAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }),
  })
  .refine((booking) => booking.startTime < booking.endTime);
export const adminBookingFiltersSchema = z.strictObject({
  page: z.coerce.number().int().min(1).max(1_000_000).default(1),
  status: bookingStatusSchema.optional(),
  date: bookingDateSchema.optional(),
  search: z.string().trim().max(100).default(""),
});
export const changeBookingStatusSchema = z
  .strictObject({
    expectedStatus: bookingStatusSchema,
    status: bookingStatusSchema,
  })
  .refine(
    (input) => canChangeBookingStatus(input.expectedStatus, input.status),
    {
      message: "Этот переход статуса недоступен.",
      path: ["status"],
    },
  );
export const adminBookingListSchema = z.strictObject({
  items: z.array(adminBookingSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.literal(20),
  timeZone: z.string().min(1),
});
export const adminDashboardSchema = z.strictObject({
  counts: z.strictObject({
    pending: z.number().int().nonnegative(),
    confirmed: z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }),
  newBookings: z.array(adminBookingSchema),
  upcomingBookings: z.array(adminBookingSchema),
  timeZone: z.string().min(1),
  today: bookingDateSchema,
});
export const adminBookingListResponseSchema = z.strictObject({
  data: adminBookingListSchema,
});
export const adminDashboardResponseSchema = z.strictObject({
  data: adminDashboardSchema,
});
export const adminBookingResponseSchema = z.strictObject({
  data: adminBookingSchema,
});
export const adminErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});
