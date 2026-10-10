"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingQueryKey } from "@/features/booking/hooks/useBookingQueries";
import {
  getAdminBookings,
  getAdminDashboard,
  changeBookingStatus,
  isAdminAccessError,
} from "../api/adminBookingsApi";
import type { AdminBookingFilters } from "../model/types";

export const adminBookingsQueryKey = ["adminBookings"];
const queryOptions = {
  staleTime: 0,
  gcTime: 0,
  refetchInterval: 30_000,
  retry: (count: number, error: Error) =>
    !isAdminAccessError(error) && count < 1,
};
export const useAdminBookings = (filters: AdminBookingFilters) =>
  useQuery({
    ...queryOptions,
    queryKey: [...adminBookingsQueryKey, "list", filters],
    queryFn: ({ signal }) => getAdminBookings(filters, signal),
  });
export const useAdminDashboard = () =>
  useQuery({
    ...queryOptions,
    queryKey: [...adminBookingsQueryKey, "dashboard"],
    queryFn: ({ signal }) => getAdminDashboard(signal),
  });
export const useChangeBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeBookingStatus,
    retry: false,
    gcTime: 0,
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminBookingsQueryKey }),
        queryClient.invalidateQueries({ queryKey: bookingQueryKey }),
      ]);
    },
  });
};
