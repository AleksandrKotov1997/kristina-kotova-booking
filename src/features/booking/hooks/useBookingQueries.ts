import { useQuery } from "@tanstack/react-query";
import { getBookingAvailability, getBookingCalendar } from "../api/bookingApi";
export const bookingQueryKey = ["booking"];
export const useBookingCalendar = () =>
  useQuery({
    queryKey: [...bookingQueryKey, "calendar"],
    queryFn: ({ signal }) => getBookingCalendar(signal),
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 1,
  });
export const useBookingAvailability = (
  serviceId: string,
  date: string | null,
) =>
  useQuery({
    queryKey: [...bookingQueryKey, "availability", serviceId, date],
    queryFn: ({ signal }) =>
      date === null ? null : getBookingAvailability(serviceId, date, signal),
    enabled: date !== null,
    staleTime: 0,
    refetchInterval: 30_000,
    retry: 1,
  });
