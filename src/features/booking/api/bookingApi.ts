import { apiClient } from "@/shared/api/apiClient";
import {
  bookingAvailabilityResponseSchema,
  bookingCalendarResponseSchema,
  bookingReceiptResponseSchema,
} from "../model/schemas";
import type { CreateBookingInput } from "../model/types";
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
