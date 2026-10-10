import { z } from "zod";

export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждена",
  cancelled: "Отменена",
  completed: "Выполнена",
};
const transitions: Record<BookingStatus, readonly BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  cancelled: [],
  completed: [],
};
export const canChangeBookingStatus = (
  current: BookingStatus,
  next: BookingStatus,
) => transitions[current].includes(next);
