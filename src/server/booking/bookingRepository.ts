import "server-only";
import { createSupabaseRestClient } from "@/shared/supabase/createSupabaseRestClient";
import {
  bookingAvailabilitySchema,
  bookingCalendarSchema,
  bookingReceiptSchema,
} from "@/features/booking/model/schemas";
import type { CreateBookingInput } from "@/features/booking/model/types";
export const getBookingCalendar = async () => {
  const response = await createSupabaseRestClient().post<unknown>(
    "/rpc/get_booking_calendar",
    {},
  );
  return bookingCalendarSchema.parse(response.data);
};
export const getBookingAvailability = async (
  serviceId: string,
  date: string,
) => {
  const response = await createSupabaseRestClient().post<unknown>(
    "/rpc/get_booking_availability",
    {
      selected_service_id: serviceId,
      selected_date: date,
    },
  );
  return bookingAvailabilitySchema.parse(response.data);
};
export const createBooking = async (input: CreateBookingInput) => {
  const response = await createSupabaseRestClient().post<unknown>(
    "/rpc/create_booking",
    {
      selected_service_id: input.serviceId,
      selected_date: input.date,
      selected_start_time: input.startTime,
      client_name: input.clientName,
      client_phone: input.clientPhone,
      request_id: input.requestId,
    },
  );
  return bookingReceiptSchema.parse(response.data);
};
