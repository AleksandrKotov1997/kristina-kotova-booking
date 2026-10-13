import { apiClient } from "@/shared/api/apiClient";
import { z } from "zod";
import {
  bookingAvailabilityResponseSchema,
  bookingCalendarResponseSchema,
  bookingReceiptResponseSchema,
  bookingReceiptSchema,
} from "../model/schemas";
import type { CreateBookingInput } from "../model/types";
const bookingRecoveryResponseSchema = z.object({
  data: bookingReceiptSchema.nullable(),
});

export const getBookingCalendar = async (signal?: AbortSignal) => {
  const response = await apiClient.get<unknown>("/booking/calendar", {
    signal,
    timeout: 15_000,
  });
  return bookingCalendarResponseSchema.parse(response.data).data;
};
export const getBookingAvailability = async (
  serviceId: string,
  date: string,
  signal?: AbortSignal,
) => {
  const response = await apiClient.get<unknown>("/booking/availability", {
    params: { serviceId, date },
    signal,
    timeout: 15_000,
  });
  return bookingAvailabilityResponseSchema.parse(response.data).data;
};
export const createBooking = async (input: CreateBookingInput) => {
  const response = await apiClient.post<unknown>("/bookings", input, {
    timeout: 15_000,
  });
  return bookingReceiptResponseSchema.parse(response.data).data;
};
export const resolveBookingRequest = async (requestId: string) => {
  const response = await apiClient.post<unknown>(
    "/bookings/recovery",
    { requestId },
    { timeout: 15_000 },
  );
  return bookingRecoveryResponseSchema.parse(response.data).data;
};
